import { NextResponse } from 'next/server';

type AssistantRequest = {
  message?: string;
};

const knowledgeBase = [
  {
    keywords: ['tinewonsa', 'project'],
    answer:
      'The Tinewonsa Project is one of DIBF’s flagship initiatives focused on sustainable giving, shared responsibility, and community-centered impact. It supports practical pathways for outreach, service, and long-term transformation.',
  },
  {
    keywords: ['volunteer', 'volunteering'],
    answer:
      'You can volunteer with DIBF by joining outreach activities, supporting events, helping with awareness campaigns, contributing professional skills, or assisting with community programs. Visit the Get Involved section or contact DIBF to express your interest.',
  },
  {
    keywords: ['impact store', 'store', 'shop'],
    answer:
      'The DIBF Impact Store turns everyday purchases into meaningful support. Purpose-driven products, awareness merchandise, apparel, lifestyle items, and limited collections help fund DIBF initiatives and community programs.',
  },
  {
    keywords: ['dollar', 'day', 'campaign'],
    answer:
      'The Dollar-A-Day campaign encourages everyday giving. Small regular contributions are pooled to support DIBF programs, outreach, healthcare access, education, and community development.',
  },
  {
    keywords: ['donate', 'giving', 'give'],
    answer:
      'You can support DIBF by donating through the Give page, supporting a campaign, purchasing from the Impact Store, or partnering with the foundation. Every contribution helps expand health, education, and community impact.',
  },
  {
    keywords: ['partner', 'partnership'],
    answer:
      'DIBF welcomes partnerships with universities, healthcare institutions, companies, foundations, development organizations, community groups, and individuals who want to create sustainable impact.',
  },
  {
    keywords: ['mental health', 'wellbeing', 'well-being'],
    answer:
      'DIBF supports mental health and wellbeing through awareness, advocacy, education, stigma reduction, and community-centered support for accessible and culturally sensitive mental healthcare.',
  },
  {
    keywords: ['mission', 'vision', 'about'],
    answer:
      'DIBF exists to advance health, human dignity, and sustainable development by connecting healthcare, education, service, philanthropy, and community engagement across Africa and underserved communities globally.',
  },
];

function getAssistantAnswer(message: string) {
  const normalized = message.toLowerCase();

  const match = knowledgeBase.find((item) =>
    item.keywords.some((keyword) => normalized.includes(keyword))
  );

  if (match) {
    return match.answer;
  }

  return 'DIBF focuses on health, human dignity, community wellbeing, youth empowerment, mental health awareness, sustainable giving, and humanitarian impact. You can ask me about volunteering, donating, partnerships, the Impact Store, or DIBF initiatives.';
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AssistantRequest;
    const message = body.message?.trim();

    if (!message) {
      return NextResponse.json({
        reply: 'Please type a question about DIBF, our initiatives, donations, volunteering, partnerships, or the Impact Store.',
      });
    }

    return NextResponse.json({
      reply: getAssistantAnswer(message),
    });
  } catch {
    return NextResponse.json(
      {
        reply:
          'Sorry, I could not process that message. Please try asking about DIBF, volunteering, donations, partnerships, or the Impact Store.',
      },
      { status: 200 }
    );
  }
}