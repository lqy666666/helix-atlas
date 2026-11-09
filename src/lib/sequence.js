export const EXAMPLES = [
  { name: '短序列练习', description: '从起始密码子到终止密码子的完整 ORF', sequence: 'ATGAAACCCGGGTTTTAG' },
  { name: '双片段样本', description: '观察多个起始位点和阅读框', sequence: 'GGGATGAAACCCGGGTTTTAGCGTACGATGCTGAAATGA' },
  { name: 'GC 丰富样本', description: '对比碱基组成与 GC 含量', sequence: 'GCGCGCATGCCCGGCGCGATCGGGTAA' },
];

export const BASES = ['A', 'T', 'C', 'G'];
export const BASE_NAMES = { A: '腺嘌呤', T: '胸腺嘧啶', C: '胞嘧啶', G: '鸟嘌呤' };
const PAIRS = { A: 'T', T: 'A', C: 'G', G: 'C' };
const STOPS = new Set(['TAA', 'TAG', 'TGA']);

export function parseSequence(raw) {
  const withoutHeaders = String(raw).split(/\r?\n/).filter(line => !line.trimStart().startsWith('>')).join('');
  const sequence = withoutHeaders.replace(/[\s\d]/g, '').toUpperCase();
  const invalid = [...new Set(sequence.replace(/[ATCG]/g, ''))];
  return { sequence, invalid };
}

export function findOrfs(sequence) {
  const orfs = [];
  for (let start = 0; start <= sequence.length - 3; start += 1) {
    if (sequence.slice(start, start + 3) !== 'ATG') continue;
    let stop = -1;
    for (let cursor = start + 3; cursor <= sequence.length - 3; cursor += 3) {
      if (STOPS.has(sequence.slice(cursor, cursor + 3))) {
        stop = cursor + 3;
        break;
      }
    }
    orfs.push({ start, end: stop < 0 ? sequence.length : stop, frame: start % 3, complete: stop >= 0 });
  }
  return orfs.sort((a, b) => Number(b.complete) - Number(a.complete) || (b.end - b.start) - (a.end - a.start) || a.start - b.start);
}

export function analyzeSequence(sequence) {
  const counts = { A: 0, T: 0, C: 0, G: 0 };
  for (const base of sequence) counts[base] += 1;
  const length = sequence.length;
  const complement = [...sequence].map(base => PAIRS[base]).join('');
  return {
    sequence,
    length,
    counts,
    gc: length ? ((counts.G + counts.C) / length) * 100 : 0,
    complement,
    reverseComplement: [...complement].reverse().join(''),
    rna: sequence.replaceAll('T', 'U'),
    orfs: findOrfs(sequence),
  };
}

export function groupSequence(sequence, groupSize = 10) {
  const chunks = [];
  for (let index = 0; index < sequence.length; index += groupSize) chunks.push(sequence.slice(index, index + groupSize));
  return chunks.join(' ');
}
