type FieldErrorProps = {
  messages?: string[];
};

export function FieldError({ messages }: FieldErrorProps) {
  if (!messages?.length) return null;

  return <p className="text-destructive text-xs">{messages[0]}</p>;
}
