import { useState } from "react";

const useForm = <T extends Record<string, any>>() => {
    const [form, setForm] = useState<T>({} as T);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        setForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    return { form, handleChange };
};

export default useForm;