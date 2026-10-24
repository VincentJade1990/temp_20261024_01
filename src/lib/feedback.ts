import type { DirectionId, FeedbackResult } from '../types'

const ENGLISH_MIN_LENGTH = 25
const OTHER_MIN_LENGTH = 12

function countEnglishSentences(text: string): number {
  return text
    .split(/[.!?。！？\n]+/)
    .map((part) => part.trim())
    .filter((part) => /[A-Za-z]{2}/.test(part)).length
}

function revise(message: string, suggestion: string): FeedbackResult {
  return { verdict: 'revise', title: '今日批注', message, suggestion }
}

function pass(message: string, suggestion: string): FeedbackResult {
  return { verdict: 'pass', title: '今日批注', message, suggestion }
}

export function evaluateSubmission(
  directionId: DirectionId,
  day: number,
  rawText: string,
): FeedbackResult {
  const text = rawText.trim()

  if (directionId === 'english') {
    if (text.length < ENGLISH_MIN_LENGTH) {
      return revise(
        '还差一点：今天的功课是 3 句完整的英文短句，目前内容偏少。',
        '先按「身份 — 年限 — 在意的事」写三行，每行一句，读一遍再提交。',
      )
    }

    if (!/[A-Za-z]{2}/.test(text)) {
      return revise(
        '今天先用英文落笔，哪怕只有三句短句，也比中文提纲更接近成果。',
        '可以照着今日课的例句，把姓名、职业、年限替换成你自己的。',
      )
    }

    if (day === 3 && /\bI work (at|for|as)\b/i.test(text) && !/\bworked\b/i.test(text)) {
      return revise(
        '表达已经基本完整。描述过去的职业经历时，建议将 “work” 改为 “worked”。',
        '例如：I worked at Tencent for four years. 全文再检查一遍动词时态。',
      )
    }

    const sentences = countEnglishSentences(text)
    const expected = day <= 3 ? 3 : 2

    if (sentences < expected) {
      return revise(
        `读到 ${sentences} 句，今天要求至少 ${expected} 句。把每件事单独成句，会比一句写很长更有力。`,
        '每句只讲一件事：身份、工作、经历，各自成句，句号收尾。',
      )
    }

    return pass(
      '表达已经基本完整，今天的句子长度和结构都站得住。',
      '建议再补一个具体细节，并大声读一遍，注意句尾的停顿。',
    )
  }

  if (text.length < OTHER_MIN_LENGTH) {
    return revise(
      '内容还略简短，暂时看不出今天要求的成果。',
      directionId === 'coding'
        ? '试着写清：页面给谁用、用户第一步做什么、最后看到什么。'
        : '试着写清：观众是谁、三十秒讲哪一件事、结尾停在哪句话。',
    )
  }

  if (directionId === 'coding') {
    const isConcrete = /(<|button|click|页面|按钮|标题|颜色|HTML|CSS)/i.test(text)
    return isConcrete
      ? pass(
          '你的成果已经完成今日基本要求，并且落到了具体的页面元素上。',
          '建议再补充一个更具体的细节，例如按钮点击后具体发生了什么。',
        )
      : pass(
          '你的成果已经完成今日基本要求。',
          '建议再补充一个更具体的细节，例如页面上的第一个按钮写什么、点了之后发生什么。',
        )
  }

  const isConcrete = /(秒|镜头|字幕|开头|结尾|剪辑|素材|节奏)/.test(text)
  return isConcrete
    ? pass(
        '你的成果已经完成今日基本要求，能看到清晰的结构意识。',
        '建议再补充一个更具体的细节，例如某个镜头的景别或某句话出现的时间点。',
      )
    : pass(
        '你的成果已经完成今日基本要求。',
        '建议再补充一个更具体的细节，例如这三十秒里观众第一眼看到什么。',
      )
}
