type ErrorMessageProps = {
  message: string;
};

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="text-center py-12 text-red-600 font-semibold">
      {message}
    </div>
  );
}
