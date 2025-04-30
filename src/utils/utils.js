import { DateTime } from 'luxon';
export function generateRange(a, b) {
  const result = [];
  for (let i = a; i <= b; i++) {
    result.push(i);
  }
  return result;
}

export function arrayIntersectionAndDifference(a, b) {
  const intersection = b.filter((item) => a.includes(item));
  const difference = b.filter((item) => !a.includes(item));

  return { intersection, difference };
}

export function getPaging({ page, itemsPerPage, sortBy }) {
  const rowFrom = page * itemsPerPage - itemsPerPage + 1;
  const rowTo = page * itemsPerPage;
  const orderField =
    sortBy === undefined || sortBy === null || sortBy.length === 0
      ? null
      : sortBy[0].key;
  const orderBy =
    sortBy === undefined || sortBy === null || sortBy.length === 0
      ? null
      : sortBy[0].order;
  return { rowFrom, rowTo, orderField, orderBy, page, itemsPerPage, sortBy };
}

export function getDateFormat(date) {
  if (date) {
    return DateTime.fromISO(date, { zone: 'utc' })
      .toFormat('dd/MM/yyyy HH:mm:ss');
  }
  return "-";
}

export function commaFormattedNumber(v) {
  if (v) {
    return Number(v).toLocaleString('en-US')
  }
  return '-';
}

export const markNumberFormatOptions = {
  mask: '9,99#',
  tokens: {
    9: { pattern: /[0-9]/, repeated: true },
  },
  reversed: true
}

export function convertCommaToPureNumber(v) {
  if (v) {
    let n = Number(`${v}`.replace(/,/g, ''))
    return n
  }
  return;
}