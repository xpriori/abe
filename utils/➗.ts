export default function splitString(
  longString: string,
  numSplits: number
): string[] {
  let stringArray: string[] = [];
  let stringLength: number = longString.length;

  for (let i = 0; i < numSplits - 1; i++) {
    let middleIndex: number = Math.floor(((i + 1) * stringLength) / numSplits);
    let spaceIndex1: number = longString.lastIndexOf(" ", middleIndex);
    let spaceIndex2: number = longString.indexOf(" ", middleIndex);
    let splitIndex: number =
      middleIndex - spaceIndex1 < spaceIndex2 - middleIndex
        ? spaceIndex1
        : spaceIndex2;
    stringArray.push(longString.slice(0, splitIndex));
    longString = longString.slice(splitIndex + 1);
    stringLength -= splitIndex + 1;
  }

  stringArray.push(longString);
  return stringArray;
}
