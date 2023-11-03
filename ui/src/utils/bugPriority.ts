export function priorityToInt(priority: string) {
  switch (priority) {
    case 'Low':
      return 1;
    case 'Middle':
      return 2;
    case 'High':
      return 3;
    default:
      return 1;
  }
}

export function intToPriority(priorityInt: number): string {
  switch (priorityInt) {
    case 1:
      return 'Low';
    case 2:
      return 'Middle';
    case 3:
      return 'High';
    default:
      return 'Low'; // Default to 'Low' if the integer doesn't match
  }
}
