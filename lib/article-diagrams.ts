export type ArticleDiagram = {
  caption: string;
  items: { title: string; detail: string }[];
};

export const articleDiagrams: Record<string, ArticleDiagram> = {
  "a-single-visit-start-to-finish": {
    caption: "A single visit's hand-off. Recheck the saved visit and invoice after each part of the workflow.",
    items: [
      { title: "Reception", detail: "Find or create the patient, then add them to the queue." },
      { title: "Consultation", detail: "Start the visit, record notes and prescriptions, and send to dispensary." },
      { title: "Dispensary", detail: "Prepare labels, dispense, review the invoice, and record payment." },
    ],
  },
  "understand-waiting-in-progress-in-dispensary-and-completed": {
    caption: "Queue status follows the patient hand-off; confirm each change on the saved visit.",
    items: [
      { title: "Waiting", detail: "Ready to see the clinician." },
      { title: "In Progress", detail: "Consultation is underway." },
      { title: "In Dispensary", detail: "Medicine and payment hand-off remains." },
      { title: "Completed", detail: "Hand-off is finished." },
    ],
  },
  "add-or-update-a-prescription": {
    caption: "Changing one medicine must leave the other prescribed lines intact. The saved visit is the final check.",
    items: [
      { title: "Review existing drugs", detail: "Check the full list before editing." },
      { title: "Change one line", detail: "Add the selected medicine or update its quantity and directions." },
      { title: "Save and reopen", detail: "Verify the selected change and every existing drug remain." },
    ],
  },
  "review-an-invoice": {
    caption: "Check identity, charges, and the correct payer before taking payment.",
    items: [
      { title: "Patient and payer", detail: "Confirm this is the right visit and billing party." },
      { title: "Billed lines", detail: "Check medicines, services, quantities, and discounts." },
      { title: "Amounts due", detail: "Separate the patient balance from any panel or corporate amount." },
    ],
  },
};
