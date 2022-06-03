import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Column, OutputType} from "../../../shared/components/table/table.component";
import {Area, Course, User} from "../../../models/Models";
import {QueryDbService} from "../../../services/firestore/query-db.service";
import {ValidateService} from "../../../services/validate/validate.service";
import {MessageService} from "primeng/api";
import {AuthService} from "../../../services/firestore/auth.service";

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
  providers: [MessageService]
})
export class StudentsComponent implements OnInit {

  loading = false;
  submited = false;
  @ViewChild('closeModal') btnCloseModal!: ElementRef<HTMLButtonElement>;
  @ViewChild('openModal') btnOpenModal!: ElementRef<HTMLButtonElement>;

  @ViewChild('closeModalReset') btnCloseModalReset!: ElementRef<HTMLButtonElement>;
  @ViewChild('openModalReset') btnOpenModalReset!: ElementRef<HTMLButtonElement>;

  @ViewChild('closeModalStat') btnCloseModalStat!: ElementRef<HTMLButtonElement>;
  @ViewChild('openModalStat') btnOpenModalStat!: ElementRef<HTMLButtonElement>;

  columns: Column[] = [
    {header: 'Código', field: 'id', type: 'text'},
    {header: 'Cédula', field: 'identificationCard', type: 'text'},
    {header: 'Apellido', field: 'lastname', type: 'text'},
    {header: 'Nombre', field: 'name', type: 'text'},
    {header: 'Correo', field: 'email', type: 'text'},
    {header: 'Estado', field: 'isActive', type: 'html-active'}
  ];
  selected: User = {
    id: '',
    isActive: false,
    name: '',
    created: null,
    email: '',
    identificationCard: '',
    lastname: '',
    observation: '',
    phone: '',
    role: 'student'
  };
  search = '';
  data: User[] = [];
  color: any = '';
  isOpened = false;
  titleModal = 'Nuevo registro';

  courseSelected: Course = {
    id: '',
    description: '',
    title: '',
    type: '',
    textColor: '',
    backgroundColor: ''
  }

  courses: Course[] = [];
  basicData = null;
  topics = [];
  gradeLabel = '0 / 10';

  constructor(
    private queryDbService: QueryDbService,
    private validateService: ValidateService,
    private messageService: MessageService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.getData();
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

  onActionOption(rowInfo: OutputType<User>) {
    this.selected = {...rowInfo.rowData}
    if (rowInfo.type === 'delete') {
      this.loading = true;
      this.queryDbService
        .deleteDoc('users', `${rowInfo.rowData.id}`)
        .subscribe(() => {
          this.data = this.data.filter(item => item.id != rowInfo.rowData.id);
          this.loading = false;
          this.showToast('success', 'Información', 'Dato eliminado correctamente');
        })
    }

    if (rowInfo.type === 'edit') {
      this.submited = false;
      this.titleModal = 'Editar registro';
      this.btnOpenModal.nativeElement.click();
    }

    if (rowInfo.type === 'view') {
      this.fillChartBarData();
      this.btnOpenModalStat.nativeElement.click();
    }

    if (rowInfo.type === 'reset') {
      this.btnOpenModalReset.nativeElement.click();
    }

  }

  onAddRegister() {
    this.selected = {
      id: '',
      isActive: false,
      name: '',
      created: null,
      email: '',
      identificationCard: '',
      lastname: '',
      observation: '',
      phone: '',
      role: 'student'
    };
    this.submited = false;
    this.titleModal = 'Nuevo registro';
    this.btnOpenModal.nativeElement.click();
  }

  getData() {
    this.loading = true;

    this.queryDbService.getCollectionsWhere([
      {collectionName: 'users', where: true, whereData: {field: 'role', operator: '==', value: 'student'}},
      {collectionName: 'courses', where: true, whereData: {field: 'isActive', operator: '==', value: true}},
      {collectionName: 'areas', where: false}
    ]).subscribe(colls => {
      this.data = colls[0] as User[];
      this.courses = colls[1] as Course[];
      this.topics = colls[2] as Area[];
      this.loading = false;
    });
  }

  onChangeRadio(value: boolean) {
    this.selected.isActive = value;
  }

  fillChartBarData(){
    if (this.selected.statisticsByTopic) {
      this.gradeLabel = '0 / 10';
      const labels = [];
      const hits = [];
      let grade = 0;
      for (const item of this.selected.statisticsByTopic) {
        const topicFound = this.topics.find(t => t.id == item.topicId);
        labels.push(topicFound.title);
        hits.push(Math.trunc(item.hitPercentage));
        grade = grade + item.hitPercentage;
      }

      if (this.selected.statisticsByTopic.length>0){
        this.gradeLabel = (grade / this.selected.statisticsByTopic.length / 10).toFixed(2) + ' / 10';
      }

      this.basicData = {
        labels,
        datasets: [
          {
            label: 'Aciertos 100%',
            backgroundColor: 'rgba(77,75,75,0.2)',
            data: [100, 100, 100, 100]
          },
          {
            label: 'Tu porcentaje (%) de aciertos',
            backgroundColor: 'rgba(3,65,121,0.5)',
            data: hits
          }
        ]
      };
    }
  }

  onSave() {
    Object
      .keys(this.selected)
      .forEach(k =>
        this.selected[k] = typeof this.selected[k] == 'string' ? this.selected[k].trim() : this.selected[k]);
    const {id, ...rest} = this.selected;

    if (!this.validateService.object(rest, ['password', 'phone', 'identificationCard', 'email', 'lastname', 'name'])) {
      this.submited = true;
      return;
    }

    this.loading = true;
    this.btnCloseModal.nativeElement.click();
    if (id == '') {
      this.queryDbService.addDoc('users', rest)
        .subscribe((response) => {
          this.data.push({
            id: response.id,
            ...rest
          });
          this.loading = false;
          this.showToast('success', 'Información', 'Dato creado correctamente');
        });
    } else {
      this.queryDbService
        .updateDoc('users', `${id}`, rest)
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

  onFilter(event: User[]) {
    this.data = event;
  }

  onResetPassword() {
    this.loading = true;
    this.btnCloseModalReset.nativeElement.click();
    this.authService.resetPassword(this.selected.email).subscribe(() => {
      this.loading = false;
      this.showToast();
    });
  }


  showToast(severity = 'success', summary = 'Acción realizada', detail = 'Acción realizada') {
    this.messageService.add(
      {
        severity,
        summary,
        detail
      });
  }

}
