import { Condition } from "../entities/condition.entity";

export const generateAllConditionAtTest = (
  conditions: Condition[],
): string[][] => {
  const conditionsAtTest: string[][] = [];
  for (const condition of conditions) {
    const { donorId, receiverId, isViceVersa } = condition.props;
    conditionsAtTest.push([donorId, receiverId]);
    if (isViceVersa) {
      conditionsAtTest.push([receiverId, donorId]);
    }
  }
  return conditionsAtTest;
};

export const countCorresponding = (
  permutations: string[][],
  conditionsAtTest: string[][],
): number => {
  let count = 0;
  for (const permutation of permutations) {
    for (const conditionAtTest of conditionsAtTest) {
      if (hasCorrespondingConditions(permutation, conditionAtTest)) {
        count++;
      }
    }
  }
  return count;
};

const hasCorrespondingConditions = (
  permutations: string[],
  conditionsAtTest: string[],
): boolean => {
  const permutationString = permutations.join("");
  const conditionAtTestString = conditionsAtTest.join("");
  const lastPermutation = permutations[permutations.length - 1];
  const lastConditionAtTest = conditionsAtTest[conditionsAtTest.length - 1];
  const conditionInPermutation = permutationString.includes(
    conditionAtTestString,
  );
  const conditionEndToStartPermutation =
    lastPermutation === conditionsAtTest[0] &&
    permutations[0] === lastConditionAtTest;
  return conditionInPermutation || conditionEndToStartPermutation;
};
