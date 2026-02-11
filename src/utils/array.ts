export const moveItem = <T>(items: T[], fromIndex: number, toIndex: number): T[] => {
  const newItems = [...items];
  const [removedItem] = newItems.splice(fromIndex, 1);
  newItems.splice(toIndex, 0, removedItem);
  return newItems;
};
