export interface SignTermProps {
  id: string;
  word: string;
  category: string | null;
  description: string | null;
  handShape: string | null;
  movement: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  source: string | null;
  createdAt: Date;
}

export class SignTerm {
  readonly id: string;
  readonly word: string;
  readonly category: string | null;
  readonly description: string | null;
  readonly handShape: string | null;
  readonly movement: string | null;
  readonly imageUrl: string | null;
  readonly videoUrl: string | null;
  readonly source: string | null;
  readonly createdAt: Date;

  constructor(props: SignTermProps) {
    this.id = props.id;
    this.word = props.word;
    this.category = props.category;
    this.description = props.description;
    this.handShape = props.handShape;
    this.movement = props.movement;
    this.imageUrl = props.imageUrl;
    this.videoUrl = props.videoUrl;
    this.source = props.source;
    this.createdAt = props.createdAt;
  }
}
