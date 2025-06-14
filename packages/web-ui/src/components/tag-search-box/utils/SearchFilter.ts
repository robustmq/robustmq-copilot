export function searchFilter(optionValue: string, inputValue: string) {
  return String(optionValue).trim().toLowerCase().includes(String(inputValue).trim().toLowerCase());
}
