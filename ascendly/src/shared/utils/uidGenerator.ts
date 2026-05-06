/**
 * Generates a persistent 21-digit numeric ID from a string input.
 * Used to provide consistent numeric IDs for email users matching the Google format.
 */
export const generateNumericId = (input: string): string => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (input.charCodeAt(i) + (hash << 5)) - hash;
  }
  let res = Math.abs(hash).toString();
  while (res.length < 21) {
    // Generate more digits based on the current string to reach 21
    res += Math.abs(Math.sin(parseInt(res.substring(0, 10)) + res.length) * 10000)
      .toString()
      .replace('.', '')
      .substring(0, 5);
  }
  return res.substring(0, 21);
};
