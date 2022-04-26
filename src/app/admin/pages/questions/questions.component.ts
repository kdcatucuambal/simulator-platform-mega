import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {QueryDbService} from "../../../services/firestore/query-db.service";
import {Observable, switchMap, throwError} from "rxjs";
import {Area, QuestionInfo, SubTopicInfo} from "../../../models/AreaModel";
import {Column, OutputType} from "../../../shared/components/table/table.component";
import {ValidateService} from "../../../services/validate/validate.service";
import {MessageService} from "primeng/api";
import {QuillModules} from "ngx-quill";
import {QuestionsAdminService} from "./services/questions-admin.service";


@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
  providers: [MessageService]
})
export class QuestionsComponent implements OnInit {

  quillSetting: QuillModules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }],
        [{ script: 'sub'}, { script: 'super' }],
        [{ align: [] }],
        [{ list: 'ordered'}, { list: 'bullet' }],
        ['formula'],
        ['clean'],
        ['image']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }

  loading = true;
  submited = false;
  @ViewChild('closeModal') btnCloseModal!: ElementRef<HTMLButtonElement>;
  @ViewChild('openModal') btnOpenModal!: ElementRef<HTMLButtonElement>;

  columns: Column[] = [
    {header: 'Código', field: 'id', type: 'text'},
    {header: 'Pregunta', field: 'descriptionWithoutFormat', type: 'text'},
    {header: 'Estado', field: 'isActive', type: 'html-active'}
  ];

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
    subtopicId: 'B7PTFysH2sQwXrfDwxsv',
    votes: []
  }
  search = '';
  questionsId = '';
  data: QuestionInfo[] = [];
  isOpened = false;
  titleModal = 'Nueva pregunta';
  areas: Area[] = [];
  currentAreaName = '';
  subtopics: SubTopicInfo[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private queryDbService: QueryDbService,
    private validateService: ValidateService,
    private messageService: MessageService,
    private questionsAdminService: QuestionsAdminService
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(
      switchMap(params => {
        this.loading = true;
        this.questionsId = params.get('id');
        if (this.questionsId) {
          return this.queryDbService.getCollectionsWhere([
            {collectionName: 'areas', where: false},
            {collectionName: this.questionsId, where: false},
            {
              collectionName: 'subtopics', where: true,
              whereData: {field: 'topicId', operator: '==', value: this.questionsId}
            },
          ]);
        }
        // noinspection JSDeprecatedSymbols
        return throwError("Something goes wrong");
      })
    ).subscribe(data => {
      this.areas = data[0] as Area[];
      this.data = data[1] as QuestionInfo[];
      this.subtopics = data[2] as SubTopicInfo[];
      const areaFound = this.areas.find(i => i.id == this.questionsId);
      this.currentAreaName = areaFound.title;
      this.loading = false;
    })
  }

  onSearch() {
    this.loading = true;
  }

  onSidebar(value: boolean) {
    if (value) {
      this.openNav();
    } else {
      this.closeNav();
    }
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

  onActionOption(rowInfo: OutputType<QuestionInfo>) {
    this.selected = {...rowInfo.rowData}
    if (rowInfo.type === 'delete') {
      this.loading = true;
      this.questionsAdminService
        .delete(this.questionsId, `${rowInfo.rowData.id}`)
        .subscribe(() => {
          this.data = this.data.filter(item => item.id != rowInfo.rowData.id);
          this.loading = false;
          this.showToast('success', 'Información', 'Dato eliminado correctamente');
        })
    }else{
      this.submited = false;
      this.titleModal = 'Editar registro';
      this.btnOpenModal.nativeElement.click();
    }
  }

  onAddRegister() {
    this.selected = {
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
      votes: []
    };
    this.submited = false;
    this.titleModal = 'Nueva pregunta';
    this.btnOpenModal.nativeElement.click();
  }

  getData() {
    this.loading = true;
    this.queryDbService.getAllDocs<QuestionInfo>(this.questionsId)
      .subscribe(data => {
        this.data = data;
        this.loading = false;
      })
  }

  onChangeRadio(value: boolean) {
    this.selected.isActive = value;
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
    this.loading = true;
    this.btnCloseModal.nativeElement.click();
    if (id == '') {

      this.questionsAdminService.add(this.questionsId, rest).subscribe((response)=>{
        this.data.push({
          id: response.id,
          ...rest
        });
        this.loading = false;
        this.showToast('success', 'Información', 'Dato creado correctamente');
      })

    } else {
      this.questionsAdminService
        .update(this.questionsId, `${id}`, rest)
        .subscribe(() => {
          this.data = this.data.map(item => {
            if (item.id == id) {
              return {
                ...this.selected
              }
            } else {
              return item;
            }
          });
          this.loading = false;
          this.showToast(
            'success',
            'Información',
            'Dato actualizado correctamente');
        })
    }

  }

  onFilter(event: QuestionInfo[]) {
    this.data = event;
  }


  showToast(severity = 'success', summary = 'Acción realizada', detail = 'Acción realizada') {
    this.messageService.add(
      {
        severity,
        summary,
        detail
      });
  }

  trackByIdx(index: number, obj: any): any {
    return index;
  }

  onChangeRadioOption(value: number) {
    this.selected.correct = value;
  }



}

function imageHandler(this: any) {
  const tooltip = this.quill.theme.tooltip;
  const originalSave = tooltip.save;
  const originalHide = tooltip.hide;
  tooltip.save = function(this: any) {
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

