import type { BookType } from './types';
import type { OrderStatus, PaymentStatus } from '../pages/admin/types';
import type { BookCopyCondition, BookCopyStatus, RentalStatus } from './api';

export function orderStatusLabel(status?: OrderStatus | string) {
    const labels: Record<string, string> = {
        NEW: 'Жаңы',
        CONFIRMED: 'Ырасталды',
        FULFILLING: 'Даярдалып жатат',
        READY_FOR_PICKUP: 'Алып кетүүгө даяр',
        SHIPPED: 'Жеткирүүгө чыгарылды',
        DELIVERED: 'Жеткирилди',
        PICKED_UP: 'Алып кетилди',
        COMPLETED: 'Аякталды',
        CANCELLED_BY_USER: 'Кардар жокко чыгарды',
        CANCELLED_OUT_OF_STOCK: 'Кампада жок болгондуктан жокко чыгарылды',
        RETURN_REQUESTED: 'Кайтаруу суралды',
        RETURNED: 'Кайтарылды',
    };
    return status ? labels[status] ?? status : '-';
}

export function paymentStatusLabel(status?: PaymentStatus | string) {
    const labels: Record<string, string> = {
        UNPAID: 'Төлөнө элек',
        PAID: 'Төлөндү',
        REFUNDED: 'Кайтарылды',
    };
    return status ? labels[status] ?? status : '-';
}

export function paymentMethodLabel(method?: string) {
    const labels: Record<string, string> = {
        CASH: 'Накталай',
        CARD: 'Карта',
        TRANSFER: 'Которуу',
    };
    return method ? labels[method] ?? method : '-';
}

export function fulfillmentTypeLabel(type?: string) {
    const labels: Record<string, string> = {
        PICKUP: 'Өзү алып кетүү',
        DELIVERY: 'Жеткирүү',
    };
    return type ? labels[type] ?? type : '-';
}

export function bookTypeLabel(type?: BookType | string | null) {
    const labels: Record<string, string> = {
        TEXTBOOK: 'Окуу китеби',
        WORKBOOK: 'Жумуш дептери',
        READING_BOOK: 'Окуу үчүн китеп',
        EXAM_PREP: 'Экзаменге даярдык',
        LANGUAGE_LEARNING: 'Тил үйрөнүү',
        PROGRAMMING: 'Программалоо',
        AI_DIGITAL_SKILLS: 'AI жана санарип көндүмдөр',
        TEACHER_RESOURCE: 'Мугалимдер үчүн материал',
        COURSE_MATERIAL: 'Курс материалы',
        CHILDREN_EDUCATION: 'Балдар билими',
        PERSONAL_DEVELOPMENT: 'Жеке өнүгүү',
    };
    return type ? labels[type] ?? type : '-';
}

export function availabilityLabel(stock?: number) {
    const value = stock ?? 0;
    if (value <= 0) return 'Кампада жок';
    if (value <= 3) return 'Аз калды';
    return 'Кампада бар';
}

export function stockText(stock?: number) {
    const value = stock ?? 0;
    return value > 0 ? `${value} даана кампада` : 'Кампада жок';
}

export function bookCopyStatusLabel(status?: BookCopyStatus | string) {
    const labels: Record<string, string> = {
        AVAILABLE: 'Бар',
        RESERVED: 'Брондолгон',
        RENTED: 'Ижарада',
        DAMAGED: 'Бузулган',
        LOST: 'Жоголгон',
        RETIRED: 'Колдонулбайт',
    };
    return status ? labels[status] ?? status : '-';
}

export function bookCopyConditionLabel(condition?: BookCopyCondition | string) {
    const labels: Record<string, string> = {
        NEW: 'Жаңы',
        GOOD: 'Жакшы',
        FAIR: 'Орточо',
        WORN: 'Эскирген',
        DAMAGED: 'Бузулган',
    };
    return condition ? labels[condition] ?? condition : '-';
}

export function rentalStatusLabel(status?: RentalStatus | string) {
    const labels: Record<string, string> = {
        DRAFT: 'Долбоор',
        ACTIVE: 'Активдүү',
        OVERDUE: 'Мөөнөтү өттү',
        RETURNED: 'Кайтарылды',
        CANCELLED: 'Жокко чыгарылды',
        LOST: 'Жоголгон',
        DAMAGED: 'Бузулган',
    };
    return status ? labels[status] ?? status : '-';
}

export function backendErrorLabel(message: string) {
    const known: Record<string, string> = {
        'Invalid credentials': 'Email же сырсөз туура эмес',
        'Email is already registered': 'Бул email менен аккаунт бар',
        'Delivery address required for DELIVERY': 'Жеткирүү үчүн дарек керек',
        'Some books not found': 'Айрым китептер табылган жок',
        'Order not found': 'Буйрутма табылган жок',
        'Book not found': 'Китеп табылган жок',
        'Only image uploads are allowed': 'Сүрөт файлдарын гана жүктөөгө болот',
        'File is required': 'Файл тандаңыз',
    };
    if (known[message]) return known[message];
    if (message.startsWith('Insufficient stock')) return 'Кампада жетиштүү китеп жок';
    return message;
}
