import { text } from "@wonderlandlabs/walrus";

export function collect(): string {
  return text.bracket("collect", "<", ">");
}
