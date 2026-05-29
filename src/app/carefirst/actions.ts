"use server";

import { z } from "zod";
import { bookAppointment } from "@/lib/db";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  age: z.coerce.number().min(1, "Age is required").max(120, "Please enter a valid age"),
  concern: z.enum(["General Checkup", "Dental", "Ortho", "Mental Health"], {
    errorMap: () => ({ message: "Please select your primary concern" }),
  }),
  appointmentDate: z.string().min(1, "Please select an appointment date"),
  appointmentTime: z.string().min(1, "Please select an appointment time"),
  preferredSlot: z.string().min(1, "Please select your preferred appointment slot"),
});

function getAgeGroup(age: number): string {
  if (age < 18) return "pediatric";
  if (age < 30) return "young adult";
  if (age < 50) return "adult";
  if (age < 65) return "mature adult";
  return "senior";
}

function generatePersonalizedEmail(data: {
  name: string;
  email: string;
  age: number;
  concern: string;
  preferredSlot: string;
}): string {
  const firstName = data.name.split(" ")[0];
  const ageGroup = getAgeGroup(data.age);

  const concernDetails: Record<string, {
    instructions: string[];
    whatToBring: string[];
    ageSpecific: string;
  }> = {
    "General Checkup": {
      instructions: [
        "Please fast for 8 hours before your appointment if bloodwork is expected.",
        "Compile a complete list of all current medications.",
      ],
      whatToBring: ["Photo ID and insurance card", "Previous lab results"],
      ageSpecific: ageGroup === "senior"
        ? "We'll focus closely on mobility, fall prevention, and age-specific screenings."
        : "We'll review your preventive care and general wellness goals.",
    },
    Dental: {
      instructions: [
        "Please brush and floss thoroughly before your appointment.",
        "Avoid eating or drinking strong coloring foods for 2 hours before.",
      ],
      whatToBring: ["Photo ID and dental insurance card", "Current night guard (if applicable)"],
      ageSpecific: ageGroup === "senior"
        ? "We'll assess gum health and any restorative needs."
        : "We'll include an oral cancer screening as part of your exam.",
    },
    Ortho: {
      instructions: [
        "Wear comfortable, loose-fitting clothing.",
        "Bring any previous imaging (X-rays, MRI, CT scans).",
      ],
      whatToBring: ["Photo ID and insurance card", "Current braces or supports"],
      ageSpecific: ageGroup === "senior"
        ? "We will discuss joint preservation and osteoarthritis management."
        : "We'll evaluate your condition for immediate relief and long-term joint health.",
    },
    "Mental Health": {
      instructions: [
        "Arrive 10 minutes early to complete our confidential intake forms.",
        "Feel free to bring a comfort item or notes about your concerns.",
      ],
      whatToBring: ["Photo ID and insurance card", "List of current medications"],
      ageSpecific: ageGroup === "senior"
        ? "We have extensive experience with older adults navigating life transitions."
        : "We take an integrative approach to manage daily stress and wellness.",
    },
  };

  const details = concernDetails[data.concern] || concernDetails["General Checkup"];
  const instructionsList = details.instructions.map((inst) => `\x07 ${inst}`).join("\n");
  const bringList = details.whatToBring.map((item) => `\x07 ${item}`).join("\n");

  return `${firstName}, ${details.ageSpecific}

To help us prepare for your visit, please note the following:
${instructionsList}

Please remember to bring:
${bringList}

We look forward to seeing you. Your health is our highest priority.`;
}

export async function submitCareFirstForm(
  prevState: unknown,
  formData: FormData
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
  aiDraftedEmail?: string;
}> {
  try {
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      age: formData.get("age"),
      concern: formData.get("concern"),
      appointmentDate: formData.get("appointmentDate"),
      appointmentTime: formData.get("appointmentTime"),
      preferredSlot: formData.get("preferredSlot"),
    };

    const validatedData = formSchema.parse(rawData);

    // 1. Save to database with double-booking check
    const dbResult = bookAppointment({
      patientName: validatedData.name,
      email: validatedData.email,
      phone: "",
      department: validatedData.concern,
      appointmentDate: validatedData.appointmentDate,
      appointmentTime: validatedData.appointmentTime,
    });

    if (!dbResult.success) {
      return { success: false, error: dbResult.error };
    }

    // 2. Generate personalized email
    const aiDraftedEmail = generatePersonalizedEmail(validatedData);

    // 3. Send to n8n webhook if configured
    const webhookUrl = process.env.CAREFIRST_N8N_WEBHOOK_URL;

    if (webhookUrl) {
      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patientName: validatedData.name,
            patientEmail: validatedData.email,
            patientAge: validatedData.age,
            concern: validatedData.concern,
            preferredSlot: validatedData.preferredSlot,
            aiDraftedEmail,
            senderEmail: "madhurhita.ganguly@codeclouds.in",
            submittedAt: new Date().toISOString(),
            triggerType: "appointment_confirmation",
          }),
        });

        if (!response.ok) {
          console.error("n8n webhook failed:", await response.text());
        }
      } catch (webhookError) {
        console.error("n8n webhook connection error:", webhookError);
      }
    } else {
      console.info("[CareFirst] CAREFIRST_N8N_WEBHOOK_URL not configured.");
    }

    return {
      success: true,
      message: `Thank you, ${validatedData.name.split(" ")[0]}! Your ${validatedData.concern.toLowerCase()} appointment has been confirmed for ${validatedData.appointmentDate} at ${validatedData.appointmentTime}. A detailed confirmation email has been sent to ${validatedData.email}.`,
      aiDraftedEmail,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("CareFirst form submission error:", error);
    return {
      success: false,
      error: "We encountered an unexpected issue. Please try again or call us at (415) 555-0192.",
    };
  }
}
