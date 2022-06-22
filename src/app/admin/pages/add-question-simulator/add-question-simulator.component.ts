import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {generate} from "short-uuid"
import {of, switchMap} from "rxjs";
import {QueryDbService} from "../../../services/firestore/query-db.service";
import {Area, QuestionInfo, SimulatorInfo} from "../../../models/Models";
import {QuestionHandlerService} from "./services/question-handler.service";
import {QuillModules} from "ngx-quill";
import {ValidateService} from "../../../services/validate/validate.service";
import {MessageService} from "primeng/api";

export interface QuestionTest {
  id: string,
  value: string
}

interface SimulatorsQuestions {
  questions: QuestionInfo[]
}

@Component({
  selector: 'app-add-question-simulator',
  templateUrl: './add-question-simulator.component.html',
  styleUrls: ['./add-question-simulator.component.scss'],
  providers: [MessageService]
})
export class AddQuestionSimulatorComponent implements OnInit {

  simulatorId = '';
  isOpened = false;

  quillSetting: QuillModules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        [{color: []}],
        [{script: 'sub'}, {script: 'super'}],
        [{align: []}],
        [{list: 'ordered'}, {list: 'bullet'}],
        ['formula'],
        ['clean'],
        ['image']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }


  simulatorInfo: SimulatorInfo = {
    id: '',
    description: '',
    isActive: false,
    instructions: '',
    minutes: 0,
    questions: '',
    type: '',
    title: '',
    textColor: '',
    imgUrl: '',
    backgroundColor: ''
  }

  loading = false;
  submited = false;
  @ViewChild('closeModal') btnCloseModal!: ElementRef<HTMLButtonElement>;
  @ViewChild('openModal') btnOpenModal!: ElementRef<HTMLButtonElement>;


  source = [];
  target = [];

  areas: Area[] = [];
  cols: any[];

  areaSelected = '';

  selected: QuestionInfo = {
    id: '',
    description: '',
    descriptionWithoutFormat: '',
    isActive: true,
    correct: 2,
    index: 0,
    options: ['', '', '', ''],
    likes: 0,
    score: 0,
    subtopicId: '',
    topicName: '',
    votes: []
  }

  questions: QuestionInfo[] = [];

  deletedId: string = '';

  @ViewChild('closeDeleteModal') btnCloseDeleteModal!: ElementRef<HTMLButtonElement>;
  @ViewChild('openDeleteModal') btnOpenDeleteModal!: ElementRef<HTMLButtonElement>;

  display: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private queryDbService: QueryDbService,
    private questionHandlerService: QuestionHandlerService,
    private validateService: ValidateService,
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(
      switchMap(params => {
        this.simulatorId = params.get('id');
        return this.queryDbService.getDocById<SimulatorInfo>('simulators', this.simulatorId);
      }),
      switchMap(simulator => {
        this.simulatorInfo = simulator as SimulatorInfo;
        if (this.simulatorInfo.questions == '') {
          return of<SimulatorsQuestions>({questions: []});
        } else {
          return this.queryDbService.getDocById<SimulatorsQuestions>('simulatorsquestions', this.simulatorInfo.questions);
        }
      })
    ).subscribe(data => {
      this.areas = this.questionHandlerService.topics;
      this.questions = data.questions.map(question => {
        return this.getTopicName(question);
      });


      this.cols = [
        {field: 'id', header: 'Código'},
        {field: 'descriptionWithoutFormat', header: 'Descripción'},
        {field: 'topicName', header: 'Tema'}
      ]
    })
  }



  getTopicName(question: QuestionInfo){
    const areaFound = this.areas.find(topic => topic.id == question.subtopicId);
    if (areaFound){
      question.topicName = areaFound.title;
      return question;
    }
    return question;
  }


  onSidebar(value: boolean) {
    if (value) {
      this.openNav();
    } else {
      this.closeNav();
    }
  }

  onChangeTopic() {
    //this.selected.subtopicId = this.areaSelected;
  }

  showDialog() {
    this.display = true;
  }

  openNav() {
    document.getElementById("mySidebar")!.style.width = "250px";
    document.getElementById("main")!.style.marginLeft = "250px";
    this.isOpened = true;
  }

  closeNav() {
    document.getElementById("mySidebar")!.style.width = "0";
    document.getElementById("main")!.style.marginLeft = "0";
    this.isOpened = false;
  }

  onSave() {

    Object
      .keys(this.selected)
      .forEach(k =>
        this.selected[k] = typeof this.selected[k] == 'string' ? this.selected[k].trim() : this.selected[k]);

    this.selected.descriptionWithoutFormat = this.validateService.htmlToText(this.selected.description);

    const {id, ...rest} = this.selected;

    if (!this.validateService.object(rest, ['description'])) {
      this.submited = true;
      return;
    }

    const auxOptions = rest.options.map(item => {
      return item.trim();
    });

    if (auxOptions.includes('')) {
      this.submited = true;
      this.showToast('error', 'Datos requeridos', 'Todos los campos son requeridos!');
      return;
    }

    this.loading = true;
    this.btnCloseModal.nativeElement.click();
    let questionsToSave = [];

    if (id == '') {
      //add
      //this.simulatorInfo.questions.push(this.selected);
      this.selected.id = generate();
      questionsToSave.push(...this.questions, this.selected);
      if (this.simulatorInfo.questions == '') {
        this.queryDbService.addDoc(
          'simulatorsquestions',
          {questions: questionsToSave}).pipe(switchMap(data => {
          this.simulatorInfo.questions = data.id;
          return this.queryDbService.updateDoc(
            'simulators',
            this.simulatorId,
            this.simulatorInfo)
        }))
          .subscribe(() => {
            this.questions = questionsToSave.map(question => {
              return this.getTopicName(question);
            });
            this.loading = false;
            this.showToast(
              'success',
              'Información',
              'Dato actualizado correctamente');

          })
      } else {
        this.queryDbService.updateDoc(
          'simulatorsquestions',
          this.simulatorInfo.questions,
          {questions: questionsToSave}
        ).subscribe(() => {
          this.questions = questionsToSave.map(question => {
            return this.getTopicName(question);
          });
          this.loading = false;
          this.showToast(
            'success',
            'Información',
            'Dato actualizado correctamente');
        })
      }

    } else {
      questionsToSave = this.questions.map(item => {
        if (item.id == this.selected.id) {
          return {
            ...this.selected
          }
        } else {
          return item;
        }
      })
      this.queryDbService.updateDoc(
        'simulatorsquestions',
        this.simulatorInfo.questions,
        {questions: questionsToSave}
      ).subscribe(() => {
        this.questions = questionsToSave.map(question => {
          return this.getTopicName(question);
        });
        this.loading = false;
        this.showToast(
          'success',
          'Información',
          'Dato actualizado correctamente');
      })
    }
  }


  trackByIdx(index: number, obj: any): any {
    return index;
  }

  onChangeRadioOption(value: number) {
    this.selected.correct = value;
  }

  onAddRegister() {
    this.selected = {
      id: '',
      description: '',
      descriptionWithoutFormat: '',
      isActive: true,
      correct: 1,
      index: 0,
      options: ['', '', '', ''],
      likes: 0,
      score: 0,
      subtopicId: '',
      topicName: '',
      votes: []
    }
    this.btnOpenModal.nativeElement.click();
  }

  onSaveNewOrder(){
    this.loading = true;
    this.queryDbService.updateDoc(
      'simulatorsquestions',
      this.simulatorInfo.questions,
      {questions: this.questions}
    ).subscribe(() => {
      this.loading = false;
      this.showToast(
        'success',
        'Información',
        'El orden se ha actualizado');
    })
  }

  onConfirmDelete() {
    this.loading = true;
    const questionsFiltered = this.questions.filter(item => item.id != this.deletedId);
    this.btnCloseDeleteModal.nativeElement.click();
    this.queryDbService.updateDoc(
      'simulatorsquestions',
      this.simulatorInfo.questions,
      {questions: questionsFiltered}
    ).subscribe(() => {
      this.questions = questionsFiltered.map(question => {
        return this.getTopicName(question);
      });
      this.loading = false;

      this.showToast(
        'success',
        'Información',
        'Dato actualizado correctamente');

    })

  }

  onActionDelete(data: QuestionInfo) {
    this.deletedId = data.id;
    this.btnOpenDeleteModal.nativeElement.click();
  }

  onActionEdit(data: QuestionInfo) {
    this.selected = data;
    this.btnOpenModal.nativeElement.click();
  }

  showToast(
    severity = 'success',
    summary = 'Acción realizada',
    detail = 'Acción realizada') {
    this.messageService.add(
      {
        severity,
        summary,
        detail
      });
  }

}

function imageHandler(this: any) {
  const tooltip = this.quill.theme.tooltip;
  const originalSave = tooltip.save;
  const originalHide = tooltip.hide;
  tooltip.save = function (this: any) {
    const range = this.quill.getSelection(true);
    const value = this.textbox.value;
    if (value) {
      this.quill.insertEmbed(range.index, 'image', value, 'user');
    }
  };
  // Called on hide and save.
  tooltip.hide = function (this: any) {
    tooltip.save = originalSave;
    tooltip.hide = originalHide;
    tooltip.hide();
  };
  tooltip.edit('image');
  tooltip.textbox.placeholder = "Embed URL";
}

