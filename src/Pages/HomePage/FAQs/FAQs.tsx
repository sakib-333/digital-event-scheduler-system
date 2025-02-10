import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import Heading from "../../../Components/Heading/Heading";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const faqs = [
  {
    id: "faq1",
    faq: "What is this platform for?",
    answer:
      "This platform allows users to schedule and manage digital events with ease. You can create events, invite participants, and set reminders all in one place.",
  },
  {
    id: "faq2",
    faq: "How do I create a new event?",
    answer:
      "To create a new event, click on the Create Event button, fill out the event details such as title, date, time, and description, and then invite participants by adding their email addresses.",
  },
  {
    id: "faq3",
    faq: "How do I change the time or date of my event?",
    answer:
      "If you need to change the time or date, simply go to your event page, select Edit and update the event details accordingly.",
  },
  {
    id: "faq4",
    faq: "Is there a limit to the number of events I can schedule?",
    answer:
      "There are no limits to the number of events you can schedule, so feel free to plan as many as you need.",
  },
  {
    id: "faq5",
    faq: "How do I delete an event?",
    answer:
      "To delete an event, go to your event page and click on Delete A confirmation will be asked to ensure you want to permanently remove the event.",
  },
];

const FAQs = () => {
  return (
    <div
      className="py-8 px-4"
      data-aos="fade-up"
      data-aos-duration="1000"
      data-aos-once="false"
    >
      <Heading title={"FAQs"} />
      <div>
        {faqs.map(({ id, faq, answer }, indx) => (
          <Accordion key={id} defaultExpanded={indx === 0}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography component="span" sx={{ fontWeight: "bold" }}>
                {faq}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ color: "text.secondary" }}>
              {answer}
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default FAQs;
