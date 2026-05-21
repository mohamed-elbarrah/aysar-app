export interface ContactMessage {
  id: number;
  type: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  status: "new" | "read" | "replied";
}

export const MESSAGES: ContactMessage[] = [
  {
    id: 5,
    type: "تواصل",
    name: "علي",
    email: "amer@gmail.com",
    phone: "0507085952",
    message: "أريد معرفة المزيد عن الباقات المتقدمة وكيفية الترقية من المجانية",
    date: "2026-05-14T19:46:00",
    status: "new",
  },
  {
    id: 4,
    type: "تواصل",
    name: "فهد",
    email: "fahd.dev@email.sa",
    phone: "0567891234",
    message: "استفسار عن التكامل مع أنظمة أخرى وAPI الخاص بكم",
    date: "2026-05-14T19:45:00",
    status: "new",
  },
  {
    id: 3,
    type: "تجربة مجانية",
    name: "سارة",
    email: "sara@realestate.sa",
    phone: "0501234567",
    message: "أرغب في طلب عرض تجريبي للمنصة لشركتنا",
    date: "2026-05-13T10:30:00",
    status: "read",
  },
  {
    id: 2,
    type: "دعم فني",
    name: "محمد",
    email: "moh@company.sa",
    phone: "0555555555",
    message: "تواجه مشكلة في رفع الصور لمراحل الإنشاء",
    date: "2026-05-12T16:20:00",
    status: "replied",
  },
  {
    id: 1,
    type: "شراكة",
    name: "نورة",
    email: "noura@partner.com",
    phone: "0577777777",
    message: "نود التعاون معكم في تقديم حلول متكاملة للمطورين العقاريين",
    date: "2026-05-10T09:15:00",
    status: "read",
  },
];
