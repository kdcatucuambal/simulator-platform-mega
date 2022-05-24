/**
 *
 * @param to intial value (include) to random
 * @param from finish value (include) to random
 * @param size size of list numbers
 * @returns randoms Number List unique random
 */
export function getRandomNumberList(to: number, from: number, size: number) {
  const nums = new Set<number>();
  while (nums.size !== size) {
    nums.add(Math.floor(Math.random() * (from - to) + to));
  }
  return [...nums];
}

