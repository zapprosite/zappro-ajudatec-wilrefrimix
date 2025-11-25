import { z } from 'zod';

// Login schema
export const loginSchema = z.object({
    email: z.string()
        .min(1, 'Email é obrigatório')
        .email('Email inválido'),
    password: z.string()
        .min(6, 'Senha deve ter no mínimo 6 caracteres'),
    rememberMe: z.boolean().optional()
});

export type LoginInput = z.infer<typeof loginSchema>;

// Register schema  
export const registerSchema = z.object({
    name: z.string()
        .min(3, 'Nome deve ter no mínimo 3 caracteres')
        .max(50, 'Nome deve ter no máximo 50 caracteres'),
    email: z.string()
        .min(1, 'Email é obrigatório')
        .email('Email inválido'),
    password: z.string()
        .min(8, 'Senha deve ter no mínimo 8 caracteres')
        .regex(/[A-Z]/, 'Senha deve conter pelo menos 1 letra maiúscula')
        .regex(/[0-9]/, 'Senha deve conter pelo menos 1 número'),
    confirmPassword: z.string(),
    termsAccepted: z.boolean()
        .refine(val => val === true, {
            message: 'Você deve aceitar os termos de uso'
        })
}).refine(data => data.password === data.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword']
});

export type RegisterInput = z.infer<typeof registerSchema>;
