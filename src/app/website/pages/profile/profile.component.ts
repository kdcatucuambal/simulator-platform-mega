import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../../services/firestore/auth.service";
import {Area, User} from "../../../models/Models";
import {QueryDbService} from "../../../services/firestore/query-db.service";
import {ValidateService} from "../../../services/validate/validate.service";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  data: any = null;
  basicData: any = null;
  labelName = '';
  initialLetters = '';
  gradeLabel = '';
  userProfile: User = {
    created: null,
    email: "",
    identificationCard: "",
    isActive: false,
    lastname: "",
    name: "",
    observation: "",
    phone: "",
    role: "student"
  }

  updateUser: User = {} as User;

  @ViewChild('closeModal') btnCloseModal!: ElementRef<HTMLButtonElement>;
  @ViewChild('openModal') btnOpenModal!: ElementRef<HTMLButtonElement>;

  loading = true;
  submited = false;
  topics: Area[] = [];

  constructor(
    private authService: AuthService,
    private queryDbService: QueryDbService,
    private validateService: ValidateService
  ) {
  }

  ngOnInit(): void {
    this.authService.isLogged.subscribe(value => {
      if (value) {
        this.queryDbService.getAllDocs<Area>('areas').subscribe(topics => {
          this.topics = topics;
          this.userProfile = this.authService.currentUserData;
          this.fillChartBarData();
          const date = this.userProfile.created as any;
          this.userProfile.created = date.toDate();
          this.labelName = this.authService.userLabelName;
          this.initialLetters = this.authService.userInitialLetters;
          this.loading = false;
        })
      }
    });
    this.checkUser();
  }

  fillChartBarData() {
    if (this.userProfile.statisticsByTopic && this.userProfile.statisticsByTopic.length > 0) {
      const labels = [];
      const hits = [];
      let grade = 0;
      for (const item of this.userProfile.statisticsByTopic) {
        const topicFound = this.topics.find(t => t.id == item.topicId);
        labels.push(topicFound.title);
        const hit = Math.trunc(item.hitPercentage);
        hits.push(hit);
        grade = grade + hit;
      }
      grade = (grade / hits.length) * 0.1;
      this.gradeLabel = grade.toFixed(2) + ' / 10';
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

  onUpdateUser() {

    const isValid = this.validateService.object(this.updateUser, ['identificationCard', 'name', 'lastname', 'phone'])

    if (!isValid) {
      this.loading = false;
      this.submited = true;
      return;
    }
    this.btnCloseModal.nativeElement.click();
    this.loading = true;
    this.queryDbService.updateDoc('users', this.updateUser.id, this.updateUser)
      .subscribe(() => {
        this.userProfile = this.updateUser;
        this.loading = false;
        this.submited = false;
        const {name, lastname} = this.userProfile;
        this.labelName = `${name.toUpperCase()} ${lastname.toUpperCase()}`;
        this.initialLetters = name[0].toLocaleUpperCase() + lastname[0].toLocaleUpperCase();
      })


  }

  onOpenModal() {
    this.updateUser = {...this.userProfile};
    this.btnOpenModal.nativeElement.click();
  }

  checkUser() {
    const user = this.authService.currentUserData;
    if (user) {
      this.queryDbService.getAllDocs<Area>('areas').subscribe(topics => {
        this.topics = topics;
        this.userProfile = user;
        this.labelName = this.authService.userLabelName;
        this.initialLetters = this.authService.userInitialLetters;
        const dateToAny = this.userProfile.created as any;
        if (isNaN(Date.parse(dateToAny))){
          this.userProfile.created = dateToAny.toDate();
        }
        this.fillChartBarData();
        this.loading = false;
      })
    }
  }
}
