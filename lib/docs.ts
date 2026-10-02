// "procedure": ordered steps you perform. "reference": an orientation overview.
// "checklist": points to confirm/verify at each checkpoint, not actions to perform.
export type ArticleFormat = "procedure" | "reference" | "checklist";

// "verify" renders the closing card as "Before you finish" (confirm the result
// of the task). "note" renders it as "Good to know" (a standing caution or fact).
export type CheckKind = "verify" | "note";

export type Article = {
  title: string;
  slug: string;
  summary: string;
  role: string;
  format: ArticleFormat;
  checkKind: CheckKind;
  steps: string[];
  check: string;
};

export type DocGroup = { title: string; articles: Article[] };
export type DocCategory = {
  title: string;
  slug: string;
  description: string;
  groups: DocGroup[];
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// checkKind defaults to "note": in this catalogue most closing cards are
// standing cautions rather than result confirmations. Pass { checkKind: "verify" }
// for genuine finish-line checks, and { format: "reference" } for overview articles.
type ArticleOptions = { format?: ArticleFormat; checkKind?: CheckKind };

const article = (
  title: string,
  summary: string,
  role: string,
  steps: string[],
  check: string,
  { format = "procedure", checkKind = "note" }: ArticleOptions = {},
): Article => ({ title, slug: slugify(title), summary, role, format, checkKind, steps, check });

const category = (
  title: string,
  description: string,
  groups: DocGroup[],
): DocCategory => ({ title, slug: slugify(title), description, groups });

export const categories: DocCategory[] = [
  category("Start here", "The essentials for a confident first day in Cleos.", [
    { title: "Orientation", articles: [
      article("Welcome to Cleos", "How Cleos fits patient care, dispensing, and billing into one system.", "All users", [
        "The sidebar moves you between patient records, appointments, the queue, consultations, and the tools available to your role.",
        "Most clinical and financial work happens inside a visit, which you open from the Queue or the patient profile.",
        "The patient profile ties a person's visits, results, letters, invoices, and appointments together in one place.",
      ], "Your clinic's permissions determine which areas and controls you can see.", { format: "reference" }),
      article("Roles and access in Cleos", "Understand what each Cleos role normally handles.", "All users", [
        "Owners manage organisation-level controls. Admins help run clinic operations, finance, stock, and reporting.",
        "Doctors and Locum Doctors start visits, document consultations, prescribe medication, and send visits to dispensary.",
        "Assistants register patients, book appointments, manage the queue, dispense medication, print labels, invoices, and receipts, and record payments where permitted.",
      ], "If a control is unavailable, ask an Owner or Admin. Never use another staff member's account.", { format: "reference" }),
      article("Find your way around Cleos", "Move from a task to the right record without losing context.", "All users", [
        "Choose the area for the task from the main sidebar.",
        "Use search, filters, and dates to find the correct patient, visit, invoice, or stock item.",
        "Open the record and check its identity and status before making changes.",
      ], "The patient profile brings visits, results, letters, and appointments together."),
    ] },
    { title: "Daily clinic flow", articles: [
      article("A single visit, start to finish", "Follow one patient's visit from reception through consultation to dispensing and payment.", "Assistant · Doctor · Locum Doctor", [
        "Assistant finds or creates the patient and adds them to the queue.",
        "Doctor or Locum Doctor starts the visit, records notes and prescriptions, then sends the visit to dispensary.",
        "Assistant prepares labels, dispenses, checks the invoice, records payment, and completes the hand-off.",
      ], "Reopen the visit and invoice to verify saved status and balances before completing the visit.", { checkKind: "verify" }),
      article("Patient-to-payment hand-off", "Keep the patient, visit, medicine, and payer aligned.", "Assistant · Doctor · Locum Doctor", [
        "Confirm the patient and active visit before the clinician begins work.",
        "Review every medicine line and direction before the visit reaches dispensary.",
        "Match the physical medicine to the prescription; then confirm billed items, payer, payment, and receipt.",
      ], "A confirmation notification is not a substitute for checking the saved record.", { format: "checklist" }),
    ] },
    { title: "Help", articles: [
      article("Get support and report an issue", "Give your clinic's support contact enough context to help quickly.", "All users", [
        "Record the Cleos area, the time, and the task you were trying to complete.",
        "Describe what happened and what you expected, including any visible error text.",
        "Follow your clinic's approved support path. Keep patient details out of ordinary email or chat unless that channel is authorised.",
      ], "For urgent clinical or financial work, follow your clinic's downtime and escalation process."),
    ] },
  ]),
  category("Patients", "Find the right record and organise upcoming care.", [
    { title: "Patient records", articles: [
      article("Find a patient before creating a record", "Avoid duplicates by searching the existing patient list first.", "Assistant", [
        "Open Patients and search using the details available to your clinic.",
        "Check matching names against another identifier before opening a record.",
        "Create a new record only when you have confirmed that the patient is not already listed.",
      ], "Keep the patient's history in one profile rather than making a new profile for each visit."),
      article("Create a patient record", "Register a patient with accurate identifying and contact details.", "Assistant", [
        "Search for the patient first, then choose Create Patient if no record exists.",
        "Enter the details required by your clinic. Check spelling and contact information with the patient.",
        "Save and reopen the profile to confirm that the details were recorded correctly.",
      ], "Do not create a second profile to correct a mistake in an existing one."),
      article("Update patient details, notes, flags, and attachments", "Keep one patient profile current and useful.", "Assistant · clinical staff", [
        "Open the confirmed patient profile and choose the relevant section.",
        "Change only the information you have verified; keep notes factual and relevant.",
        "Review the saved detail, flag, or attachment in the same profile.",
      ], "Check that an attachment belongs to this patient before saving it.", { checkKind: "verify" }),
      article("Review a patient's visit history", "Use the patient profile to understand previous care.", "Doctor · Locum Doctor · Assistant", [
        "Find and open the correct patient profile.",
        "Open the visits tab and select the visit you need.",
        "Review the recorded notes, medicine, documents, and account information available to your role.",
      ], "Use the existing history as context; do not copy old information into a new visit without checking it."),
    ] },
    { title: "Appointments", articles: [
      article("Book an appointment", "Reserve the right service, provider, and time for a patient.", "Assistant", [
        "Find the patient before opening Appointments.",
        "Choose the service, available provider, date, and time shown for the clinic.",
        "Save, then reopen the appointment to confirm its patient, time, and status.",
      ], "Check existing bookings before adding a second appointment for the same visit."),
      article("Reschedule or cancel an appointment", "Change a booking while keeping the patient informed.", "Assistant", [
        "Open the patient's existing appointment rather than creating a duplicate.",
        "Use the available reschedule or cancellation action and confirm the new details or reason.",
        "Reopen the calendar and the patient profile to verify the change.",
      ], "Tell the patient the confirmed new time or cancellation through your clinic's normal process."),
      article("Manage appointment status", "Keep the calendar aligned with what actually happened.", "Assistant", [
        "Open the relevant appointment in the calendar or patient profile.",
        "Choose the status that matches the patient's real attendance and the clinic's workflow.",
        "Save and check the updated appointment in the calendar view.",
      ], "An appointment status is separate from the status of a consultation visit in the queue."),
    ] },
  ]),
  category("Queue and consultation", "Move each visit through clinical care with clear ownership.", [
    { title: "Manage the queue", articles: [
      article("Add a patient to the queue", "Prepare a confirmed patient for the clinician.", "Assistant", [
        "From Queue, use Search patients to find the correct patient. Check for an existing active visit before selecting the patient.",
        "Select the patient, choose a room if prompted, and add them to the queue. Confirm their row appears with Waiting status.",
        "Alternatively, open Patients, find the correct patient, and use Add to queue on their row. Choose a room if prompted, then confirm the Waiting entry on Queue.",
      ], "Check the patient and current visit before adding them; do not create a duplicate active visit."),
      article("Understand Waiting, In Progress, In Dispensary, and Completed", "Read the four queue statuses as a patient hand-off.", "Assistant · Doctor · Locum Doctor", [
        "Waiting: the patient is waiting to see a Doctor or Locum Doctor.",
        "In Progress: the Doctor or Locum Doctor is seeing the patient.",
        "In Dispensary: consultation work is complete and the patient is waiting for medicine and payment.",
        "Completed: the medicine and payment hand-off is finished.",
      ], "Check the status on the saved visit, especially after a hand-off.", { format: "reference" }),
      article("Remove an early-stage visit from the queue", "Understand when Remove from Queue is available.", "Authorised staff", [
        "Find the correct queue row and verify the visit is Waiting or In Progress.",
        "Use Remove from Queue only when the early visit should no longer appear in the queue.",
        "Confirm the patient profile remains and the unpaid draft invoice for that visit is discarded.",
      ], "In Dispensary and Completed visits are not removable. Ask an authorised Owner or Admin about the appropriate financial correction."),
    ] },
    { title: "Conduct a consultation", articles: [
      article("Start a visit", "Begin clinical work from the right queue entry.", "Doctor · Locum Doctor", [
        "Open the queue entry and confirm the patient and assigned visit.",
        "Start the visit from that entry.",
        "Check the visit is In Progress before recording consultation details.",
      ], "Review relevant patient history before adding new clinical information."),
      article("Record vital signs and case notes", "Document observations and the consultation in the visit.", "Doctor · Locum Doctor", [
        "Open the confirmed active visit and enter the observations that were actually taken.",
        "Record clear case notes and any relevant clinical findings.",
        "Save, then reopen the visit to verify the notes and values.",
      ], "Check units and patient identity before saving clinical values.", { checkKind: "verify" }),
      article("Send a visit to dispensary", "Hand a completed consultation to the dispensing team.", "Doctor · Locum Doctor", [
        "Finish and review clinical notes, medicines, and any required documents.",
        "Send the visit to dispensary using the visit control.",
        "Confirm the visit moves to In Dispensary and tell the Assistant about any special instructions.",
      ], "Review prescription lines before hand-off; the Assistant uses them for labelling and dispensing.", { checkKind: "verify" }),
    ] },
  ]),
  category("Prescribing and dispensing", "Keep prescriptions, labels, and physical medicine consistent.", [
    { title: "Prescriptions", articles: [
      article("Add or update a prescription", "Add a medicine or change its selected line in the visit.", "Doctor · Locum Doctor", [
        "Open the correct visit and go to Billing & Prescription.",
        "Add the selected medicine or update its quantity and directions.",
        "Review the full list before saving, then reopen it to confirm existing medicine lines remain.",
      ], "Changing one medicine should not remove other prescribed drugs. Stop and report it if the saved list changes unexpectedly."),
      article("Review prescription lines before saving", "Catch quantity, directions, and duplicate mistakes early.", "Doctor · Locum Doctor", [
        "Compare every line with the intended treatment and patient record.",
        "Check medicine, strength, directions, quantity, and any duplicate or discontinued line.",
        "Save and reopen the visit to verify the complete prescription.",
      ], "Do not rely on a confirmation message alone; the saved list is the source to check."),
    ] },
    { title: "Dispensing", articles: [
      article("Prepare and print medicine labels", "Make labels match the approved prescription.", "Assistant", [
        "Open the correct In Dispensary visit and review the medicine lines.",
        "Check the patient's name, medicine, directions, quantity, and number of labels.",
        "Preview and print only after those details match the physical pack.",
      ], "Reprint a corrected label if any displayed detail is wrong; do not hand over a mismatched label."),
      article("Dispense medication", "Record the hand-over after checking the physical medicine.", "Assistant", [
        "Match the medicine, strength, and quantity to the visit and printed label.",
        "Give the patient the instructions required by your clinic's dispensing process.",
        "Record dispensing and verify the saved visit before completing the hand-off.",
      ], "Escalate stock shortages or prescription discrepancies to the clinician before handing over medicine."),
    ] },
    { title: "Clinical documents", articles: [
      article("Print a medical certificate", "Create a certificate from the correct visit details.", "Doctor · Locum Doctor", [
        "Open the confirmed visit and choose Print MC in Billing & Prescription.",
        "Select the correct certificate details and date range.",
        "Inspect the preview before printing or sharing the output.",
      ], "Printing does not verify that visit data saved correctly; check the saved visit separately.", { checkKind: "verify" }),
      article("Review previous clinical documents", "Find earlier certificates, notes, and dispensed items.", "Doctor · Locum Doctor · authorised staff", [
        "Open the patient's profile and choose the relevant previous visit.",
        "Review the available certificate, case note, dispensed item, or account view.",
        "Confirm the document belongs to the visit and date you intended.",
      ], "Keep historical information in its original record."),
    ] },
  ]),
  category("Results and patient communication", "Keep clinical outputs and follow-up attached to the right patient.", [
    { title: "Test results", articles: [
      article("Create and review a test result", "Record the correct test and its outcome for a patient.", "Doctor · Locum Doctor", [
        "Find the patient, then open Results or the patient's test results.",
        "Choose the correct test type and enter or attach the reviewed outcome.",
        "Save and check the result from the patient profile.",
      ], "Confirm the result and its attachment belong to the same patient before saving.", { checkKind: "verify" }),
      article("Attach result documents to the right patient", "Keep external result files with the correct record.", "Doctor · Locum Doctor · authorised staff", [
        "Open the confirmed patient and the relevant result.",
        "Check the document's name, date, and patient identifiers before attaching it.",
        "Open the saved result to confirm the attachment is present and readable.",
      ], "Do not attach another patient's document as a temporary placeholder."),
    ] },
    { title: "Follow-up", articles: [
      article("Send follow-up messages", "Contact the intended patient with reviewed wording.", "Assistant · clinician", [
        "Open Follow-up and select the appropriate patient or response list.",
        "Choose a reviewed template or message and verify the recipient.",
        "Send through the clinic's approved channel and check the recorded outcome.",
      ], "Use a suitable private channel for sensitive health information."),
      article("Review patient feedback", "Read responses and route them to the right team.", "Assistant · clinician", [
        "Open Responses in Follow-up and filter to the relevant period or patient.",
        "Read the response in context, including any earlier follow-up.",
        "Record or escalate an action under the clinic's process.",
      ], "Treat urgent care concerns as clinical work, not just routine feedback."),
    ] },
    { title: "Letters", articles: [
      article("Create a patient letter from a template", "Start from approved wording and the right patient.", "Doctor · Locum Doctor", [
        "Open the correct patient and select the suitable letter template.",
        "Complete the case-specific information and review populated patient details.",
        "Save the letter with the patient record.",
      ], "A template still needs a full review before it is sent or printed."),
      article("Review and print a letter", "Check the final document before it leaves the clinic.", "Doctor · Locum Doctor · authorised staff", [
        "Open the saved letter from the patient profile.",
        "Check recipient, date, medical wording, and any filled fields.",
        "Preview and print or share according to clinic policy.",
      ], "Confirm the printout matches the saved version.", { checkKind: "verify" }),
    ] },
  ]),
  category("Billing, payments, and corrections", "Keep charges, payments, and corrections traceable.", [
    { title: "Invoices and payments", articles: [
      article("Review an invoice", "Check the billed work before collecting payment.", "Assistant · authorised finance staff", [
        "Open the correct visit or invoice and confirm the patient and payer.",
        "Review medicine, services, quantities, discounts, and totals.",
        "Check what the patient owes separately from any panel or corporate amount.",
      ], "Correct a disputed item through the authorised workflow before taking payment."),
      article("Record a payment", "Save money received against the correct invoice.", "Assistant · authorised finance staff", [
        "Confirm the invoice, payer, amount due, and payment method.",
        "Record the amount actually received.",
        "Reopen the invoice and verify paid and outstanding balances.",
      ], "Never assume a confirmation message means the balance has updated."),
      article("Print an invoice or receipt", "Give the patient the right financial document.", "Assistant · authorised finance staff", [
        "Verify invoice lines and payer before printing an invoice.",
        "Record and confirm payment before printing a receipt.",
        "Inspect the output and match its totals to the saved invoice.",
      ], "A receipt represents a recorded payment, not a planned payment."),
    ] },
    { title: "Corrections", articles: [
      article("Void an invoice correctly", "Use a protected correction with an accurate reason.", "Owner · Admin · authorised finance staff", [
        "Find the exact invoice and confirm why it must be voided.",
        "Use the available Void action and enter a clear, non-empty reason.",
        "Reopen the invoice and verify its status and remaining financial position.",
      ], "Voiding an invoice does not automatically void related payments."),
      article("Reconcile related payments after a correction", "Check every financial effect after an invoice change.", "Owner · Admin · authorised finance staff", [
        "Review the corrected invoice and any linked payment records.",
        "Use the authorised payment correction process when a payment must also change.",
        "Verify paid, outstanding, and panel balances separately against the audit history.",
      ], "Keep the original reason and correction trail available for reconciliation."),
    ] },
  ]),
  category("Corporate, panel, and rewards", "Understand who pays and how benefits apply.", [
    { title: "Panel and corporate patients", articles: [
      article("Link and verify corporate coverage", "Check the patient's organisation and applicable benefits.", "Owner · Admin · Assistant", [
        "Open the confirmed patient and corporate organisation record.",
        "Check the link, eligibility, coverage rules, and pricing for the visit.",
        "Confirm which items the patient must pay for directly.",
      ], "A linked organisation does not mean every item is covered."),
      article("Record co-payments and panel settlement", "Keep patient and panel amounts under the right payer.", "Assistant · authorised finance staff", [
        "Review the invoice and the amount due from the patient separately from the panel amount.",
        "Record any patient co-payment against the correct payer.",
        "Record and reconcile panel settlement using the approved clinic process.",
      ], "Verify the resulting patient and corporate outstanding balances separately.", { checkKind: "verify" }),
    ] },
    { title: "Pricing and loyalty", articles: [
      article("Manage tier pricing", "Review the price level that applies to an item or patient.", "Owner · Admin", [
        "Open Tier and identify the relevant price group.",
        "Review item prices and the intended patient or organisation context.",
        "Save a permitted change, then check the displayed amount before using it in billing.",
      ], "Use the clinic's approval process before changing live prices."),
      article("Use Rewards and Loyalty", "Work only with the loyalty areas enabled for your clinic.", "Owner · Admin · authorised staff", [
        "Open Rewards & Loyalty and choose an enabled program or stamp card.",
        "Check the patient's eligibility and the applicable reward rules.",
        "Record a reward or redemption only through an available action and verify the result.",
      ], "Do not rely on an area labelled Coming soon for routine clinic work."),
    ] },
  ]),
  category("Inventory and suppliers", "Maintain dependable stock and supplier records.", [
    { title: "Inventory", articles: [
      article("Maintain item and service details", "Keep names, units, and catalogue information accurate.", "Owner · Admin", [
        "Open Inventory and find the item or service before adding another entry.",
        "Review its name, category, unit, and any settings that affect billing or stock.",
        "Save and reopen the record to confirm the details.",
      ], "Duplicate items can create billing and stock mistakes; search first."),
      article("Record stock movements and adjustments", "Explain why stock changed and confirm the units.", "Owner · Admin", [
        "Find the exact inventory item and confirm its unit of measure.",
        "Choose the appropriate movement or adjustment and enter the actual reason and quantity.",
        "Review the updated balance and item history.",
      ], "Never use an adjustment to hide an unexplained difference."),
      article("Complete a stock take", "Compare counted stock with Cleos in a controlled pass.", "Owner · Admin", [
        "Choose the stock take for the correct clinic scope and item set.",
        "Count physical units and enter the observed quantity for each item.",
        "Review differences before confirmation and retain the approved result.",
      ], "Investigate large or unexpected differences before changing the stock record."),
      article("Investigate stock discrepancies", "Trace a difference to its source before correcting it.", "Owner · Admin", [
        "Review the item balance, movement history, and recent stock takes.",
        "Check dispensing records, units, and any receiving or adjustment activity.",
        "Document the cause and make only the authorised correction.",
      ], "Use inventory reports to check whether the discrepancy affects other items."),
    ] },
    { title: "Suppliers", articles: [
      article("Maintain supplier contacts and product details", "Keep the supplier directory useful for authorised staff.", "Owner · Admin", [
        "Search Suppliers before creating another supplier record.",
        "Add or update contact details and linked product information that your clinic has verified.",
        "Save and reopen the directory entry to confirm it is current.",
      ], "Follow your clinic's purchasing procedure for orders and deliveries."),
    ] },
    { title: "Purchasing and deliveries", articles: [
      article("Understand purchase requisition statuses", "See where a purchase requisition (PR) stands in the approval process.", "Staff with purchasing access", [
        "Draft: the requisition is being prepared and has not been sent for approval.",
        "Pending Approval: the requisition is waiting for a doctor's decision.",
        "Approved: a doctor has approved the requisition.",
        "Rejected: a doctor has rejected the requisition.",
      ], "Check the requisition itself for the latest status before creating or changing a related order.", { format: "reference" }),
      article("Understand purchase order statuses", "Track approval, supplier hand-off, and receipt of a purchase order (PO).", "Staff with purchasing access", [
        "Draft: the order is being prepared.",
        "Pending Approval: the order is waiting for a doctor's decision.",
        "Approved: a doctor has approved the order.",
        "Sent to Supplier: the order has been sent to the supplier.",
        "Partially Received: linked delivery orders show that some items have been received, but the order is not complete.",
        "Received: linked delivery orders show that all ordered items have been received.",
        "Cancelled: the order has been cancelled.",
        "Rejected: a doctor has rejected the order.",
      ], "A separate Voided status is not currently available for purchase orders. Receiving status reflects linked delivery orders; check those records for item-level details.", { format: "reference" }),
      article("Understand delivery order statuses", "See whether a delivery order (DO) has been confirmed and received.", "Staff with purchasing access", [
        "Draft: the delivery order is being prepared.",
        "Confirmed: the delivery order has been created, but no items have been received yet.",
        "Partially Received: some items have been received, while others are still outstanding.",
        "Received: all items on the delivery order have been received.",
        "Rejected: the delivery order has been rejected.",
        "Voided: the delivery order has been voided.",
      ], "Check received quantities on the delivery order; a partially received order still has outstanding items.", { format: "reference" }),
    ] },
  ]),
  category("Reports", "Choose the right figures, date range, and scope.", [
    { title: "Run reports", articles: [
      article("Choose the right report", "Start with the question you need the report to answer.", "Owner · Admin", [
        "Open Reports and choose financial, clinical, patient, or stock reporting as appropriate.",
        "Check what each report measures before comparing its numbers with another report.",
        "Set the date and clinic scope before generating results.",
      ], "A report about visits may not use the same population as a report about payments."),
      article("Set dates and reporting scope", "Keep branches and time periods consistent.", "Owner · Admin", [
        "Choose the start and end dates for the question being asked.",
        "Confirm branch or organisation scope where that control is available.",
        "Generate the report after changing a filter and check the displayed scope.",
      ], "Do not compare numbers from different scopes or periods as though they are equivalent."),
      article("Export and retain reports", "Keep approved report output with its context.", "Owner · Admin", [
        "Generate the report using the confirmed filters.",
        "Review its totals and scope before exporting.",
        "Save the output in the location required by your clinic's records policy.",
      ], "Regenerate after any filter change before exporting."),
    ] },
    { title: "Report types", articles: [
      article("Financial reports", "Review sales, payments, and outstanding amounts.", "Owner · Admin", [
        "Choose the financial report that matches the question.",
        "Set the period and branch or organisation scope.",
        "Review paid, outstanding, and panel amounts separately before using the figures.",
      ], "Corrections and voids can affect different financial measures in different ways."),
      article("Clinical and patient reports", "Review visit and patient activity in context.", "Owner · Admin", [
        "Choose the relevant clinical or patient report.",
        "Set the period and scope, then generate the result.",
        "Read the report definition before drawing conclusions from totals.",
      ], "Use approved channels and storage for any exported patient-level data."),
      article("Inventory reports", "Use stock reports to spot movement and count issues.", "Owner · Admin", [
        "Choose the stock report for levels, movement, or alerts.",
        "Set the relevant date and branch scope.",
        "Follow up unusual values in the item history before adjusting stock.",
      ], "A report highlights differences; the item record provides the trace."),
    ] },
  ]),
  category("Manage your clinic", "Configure the clinic experience and access with care.", [
    { title: "Public booking", articles: [
      article("Set up the booking site", "Prepare the public booking experience for patients.", "Owner · Admin", [
        "Open Booking and review site presentation, contact information, and form fields.",
        "Set categories and services using clear patient-facing wording.",
        "Preview the page on phone and desktop before publishing.",
      ], "Check the clinic's actual availability and follow-up process before publishing."),
      article("Manage services and appointment availability", "Keep public choices aligned with the clinic calendar.", "Owner · Admin", [
        "Open the relevant booking category and service.",
        "Confirm the provider assignment, duration, and availability shown to patients.",
        "Save and preview the service before making it public.",
      ], "Do not publish a service until staff can honour the available times."),
      article("Preview and publish booking changes", "Check the patient view before it goes live.", "Owner · Admin", [
        "Use the Booking preview in both phone and desktop views.",
        "Check names, contact fields, available providers, times, and patient-facing text.",
        "Publish only after the clinic confirms that the change is ready.",
      ], "After publishing, open the public page and confirm it reflects the approved change.", { checkKind: "verify" }),
    ] },
    { title: "Organisation and branch settings", articles: [
      article("Manage organisation details", "Review settings that affect the whole clinic organisation.", "Owner", [
        "Open Settings and identify whether the change applies to the organisation or a branch.",
        "Check the existing value and make the smallest approved change.",
        "Save, then verify the setting in the intended scope.",
      ], "Organisation settings can affect more than one branch; confirm scope before saving.", { checkKind: "verify" }),
      article("Manage payment methods, templates, print setup, and test types", "Keep branch tools aligned with clinic policy.", "Owner · Admin", [
        "Open the relevant Settings section for the task.",
        "Review the active branch or organisation scope where it is available.",
        "Make the approved change and preview or test the result before routine use.",
      ], "A print preview checks layout; verify the saved data separately.", { checkKind: "verify" }),
    ] },
    { title: "Users and access", articles: [
      article("Add or manage a user", "Give staff the role and access they need for their work.", "Owner · Admin", [
        "Open User management and search for the person before adding another account.",
        "Assign the appropriate Cleos role and review any available access settings.",
        "Check ownership, audit requirements, and active work before disabling or deleting access.",
      ], "Use least privilege and never share accounts."),
      article("Reset access and passwords", "Help a user regain access through the approved flow.", "Owner · Admin · account holder", [
        "Confirm the person and the account that needs access help.",
        "Use the available reset or account recovery action rather than sharing a password.",
        "Ask the user to complete the reset privately and confirm they can sign in.",
      ], "Treat reset links, codes, and credentials as secrets."),
      article("Review system logs", "Trace important changes through the available audit record.", "Owner · Admin", [
        "Open System logs in Settings.",
        "Filter by the relevant time and activity when available.",
        "Compare the entry with the associated patient, visit, invoice, or setting before drawing a conclusion.",
      ], "Keep exported or shared audit information within approved clinic channels."),
    ] },
    { title: "Integrations and personal settings", articles: [
      article("Configure integrations and e-invoicing", "Set up external connections and invoice settings carefully.", "Owner · Admin", [
        "Open the relevant Settings section and confirm the intended organisation or branch scope.",
        "Enter approved configuration values through Cleos and save the change.",
        "Test a permitted non-production example or preview before relying on the new setting.",
      ], "Keep keys, tokens, QR links, and invoice credentials out of screenshots and ordinary messages."),
      article("Update your profile", "Keep your own account details current.", "All users", [
        "Open Settings and choose Profile.",
        "Update the information your account is allowed to change.",
        "Save and reopen the profile to check the new value.",
      ], "If a field is locked, ask an Owner or Admin for the correct route."),
      article("Personalise your Cleos layout", "Arrange the page to suit your daily tasks.", "All users", [
        "Open Customize Page in Settings when your role can access it.",
        "Make a small layout change and preview it before relying on it.",
        "Export your settings before larger changes so you can restore the arrangement.",
      ], "Page customisation is stored on the current device; it may not follow you to another computer."),
    ] },
  ]),
];

export const allArticles = categories.flatMap((item) =>
  item.groups.flatMap((group) => group.articles),
);

export const articleBySlug = (slug: string) =>
  allArticles.find((item) => item.slug === slug);

export const articleLocation = (slug: string) => {
  for (const item of categories) {
    for (const group of item.groups) {
      const found = group.articles.find((entry) => entry.slug === slug);
      if (found) return { category: item, group, article: found };
    }
  }
  return undefined;
};
