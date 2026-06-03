export interface NoticeAttachment {
  name: string;
  url: string;
  size?: number;
  type?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  isImportant: boolean;
  attachments: NoticeAttachment[];
}
