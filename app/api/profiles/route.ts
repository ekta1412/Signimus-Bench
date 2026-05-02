import { NextResponse } from "next/server";

export async function GET() {
  const data = [
    {
      id: "ekts-roy",
      name: "Ekta Roy",
      title: "Frontend Developer",
      experience: "0 years",
      skills: ["HTML", "CSS", "javascript", "React.js"],
      monthlyRate: "30,000",
      resumeLink: "Profile on Request",
      marketRate: "80,000"
    },
    {
      id: "bhavesh-mistry",
      name: "Bhavesh Mistry",
      title: "Full Stack Designer",
      experience: "4 years",
      skills: [
        "Design",
        "Bootstrap",
        "Tailwind CSS",
        "Material UI",
        "Responsive Design",
        "Animations",
        "Figma",
        "Photoshop",
        "Adobe XD",
        "React.js",
        "Ruby on Rails",
        ".NET",
        "Angular"
      ],
      monthlyRate: "On Request",
      resumeLink: "Profile on Request",
      marketRate: "75,000"
    },
    {
      id: "sagar-shinde",
      name: "Sagar Shinde",
      title: "Senior Java Developer",
      experience: "3 years",
      skills: [
        "Core Java",
        "Spring",
        "Spring Boot",
        "REST API",
        "Spring Data JPA",
        "Hibernate",
        "JPA",
        "MySQL",
        "Kafka",
        "Redis",
        "AWS",
        "Spring Security"
      ],
      monthlyRate: "On Request",
      resumeLink: "Profile on Request",
      marketRate: "70,000"
    },
    {
      id: "abhishek-parihar",
      name: "Abhishek Parihar",
      title: "Full Stack Java/Python Developer",
      experience: "6 years",
      skills: [
        "Java",
        "Spring",
        "Spring Boot",
        "REST API",
        "Spring Data JPA",
        "Hibernate",
        "JPA",
        "MySQL",
        "Kafka",
        "Redis",
        "AWS",
        "Spring Security",
        "Python3",
        "Django",
        "Rest Framework",
        "Git",
        "Bit-bucket",
        "SQLite",
        "Slack",
        "JIRA",
        "Scrum",
        "Kan-ban"
      ],
      monthlyRate: "On Request",
      resumeLink:
        "https://docs.google.com/document/d/10Xpu8R1Zy7rfCIKRHIrzpDJKhoOfOTz8n084f5pK5BI/edit",
      marketRate: "120,000"
    },
    {
      id: "shikha-gupta",
      name: "Shikha Gupta",
      title: "Marketing Specialist",
      experience: "2 years",
      skills: ["Marketing"],
      monthlyRate: "On Request",
      resumeLink: "Profile on Request",
      marketRate: "50,000"
    },
    {
      id: "aishwarya-kulkarni",
      name: "Aishwarya Kulkarni",
      title: "UI/UX Designer",
      experience: "5 years",
      skills: [
        "Product Designer",
        "UI/UX",
        "Graphics Design",
        "Figma",
        "XD",
        "Davanci Resolve",
        "UIZARD",
        "Zeplin",
        "Photoshop",
        "Illustrator",
        "Canva"
      ],
      monthlyRate: "On Request",
      resumeLink: "Profile on Request",
      marketRate: "90,000"
    }
  ];

  return NextResponse.json(data);
}