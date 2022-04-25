export interface Area{
  id: string,
  title: string,
  description: string,
  imgUrl?: string,
  isActive?: boolean,
  backgroundColor: string,
  textColor: string,
  type: string
}

export interface Course extends  Area{

}

export interface CarouselInfo extends Omit<Area, 'textColor' | 'backgroundColor' | 'type'>{

}

export interface SimulatorInfo extends Course{
  minutes: number,
  hours: number,
  seconds: number,
  instructions: string,
  questions: string
}

export interface TitleInfo{
  id: string,
  type: string,
  value: string,
  info: string
}

export interface AlertInfo{
  id: string,
  value: string,
  withoutFormat: string,
  isActive: boolean,
  severity: string
}

export interface SubTopicInfo{
  id: string,
  subtopic: string,
  topicId: string,
  topicName: string,
  isActive: boolean
}

export interface QuestionInfo{
  id: string,
  index: number
  description: string,
  descriptionWithoutFormat: string,
  correct: number,
  subtopicId: string,
  topicId?: string,
  topicName?: string,
  options: string[],
  likes: number,
  score: number
  votes: string[]
  isActive: boolean
}
