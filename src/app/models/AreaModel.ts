export interface Area{
  id: string,
  title: string,
  description: string,
  imgUrl?: string,
  isActive?: boolean,
  backgroundColor: string,
  textColor: string,
  type: string,
  questions?: number
}

export interface Course extends  Area{

}

export interface CarouselInfo extends Omit<Area, 'textColor' | 'backgroundColor' | 'type'>{

}

export interface SimulatorInfo extends Omit<Course, 'questions'>{
  minutes: number,
  instructions: string,
  questions: string,
  time?: Date
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
  index?: number
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
  isActive: boolean,
  btnStatus?: string,
  selectedOption?: number
}

export interface User{
  id?: string,
  identificationCard: string,
  name: string,
  lastname: string,
  email: string,
  isActive: boolean,
  phone: string,
  role: 'admin' | 'student',
  observation: string,
  password?: string,
  course?: Course,
  created: Date,
  statisticsByTopic?: InfoByTopic[],
  statisticsBySimulator?: InfoBySimulator[]
}



export interface InfoByTopic{
  topicId: string,
  hitPercentage: number
}

export interface InfoBySimulator{
  simulatorId: string,
  hits: number,
  total: number,
  attemps: number,
  average: number
}

