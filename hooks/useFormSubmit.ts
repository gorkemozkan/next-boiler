import { useState } from 'react';

interface Props {
  url: string;
  formData: Record<string, unknown>;
  onSubmit: () => void;
}

const useFormSubmit = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    setError('');

    try {
      const response = await fetch(props.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(props.formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      props.onSubmit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, handleSubmit };
};

export default useFormSubmit;
