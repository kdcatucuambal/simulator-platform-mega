import {Component, OnInit} from '@angular/core';
import {QueryDbService} from "../../../services/firestore/query-db.service";
import {Course, User} from "../../../models/Models";
import {ValidateService} from "../../../services/validate/validate.service";
import {AuthService} from "../../../services/firestore/auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  courses: Course[] = [];
  user: User = {
    role: 'student',
    password: '',
    phone: '',
    observation: '',
    identificationCard: '',
    email: '',
    isActive: false,
    lastname: '',
    name: '',
    course: null,
    created: null,
    statisticsByTopic: [],
    statisticsBySimulator: []
  }
  courseSelected = '';
  submited = false;
  errorSave = false;
  saveSuccess = false;

  message = ''

  constructor(
    private queryDbService: QueryDbService,
    private validateService: ValidateService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.queryDbService.getDocsWhere<Course>(
      'courses',
      'isActive',
      '==',
      true).subscribe(data => {
      this.courses = data;
    });
  }


  createUser() {
    this.submited = false;
    this.user.course = this.courses.find((item)=> item.id == this.courseSelected)

    Object
      .keys(this.user)
      .forEach(k =>
        this.user[k] = typeof this.user[k] == 'string' ? this.user[k].trim() : this.user[k]);


    if (!this.validateService.object(
      this.user,
      ['password', 'phone', 'identificationCard', 'email', 'lastname', 'name'],
      )){
      this.message = 'Todos los campos son obligatorios'
      this.submited = true;
      return;
    }

    if (this.courseSelected == ''){
      this.message = 'Todos los campos son obligatorios'
      this.submited = true;
      return;
    }

   if (!this.validateService.validateEmail(this.user.email)){
     this.user.email = '';
     this.message = 'El correo ingresado no es válido'
     this.submited = true;
     return;
   }

   if (this.user.password.length < 6){
     this.user.password = '';
     this.message = 'La contraseña debe tener mínimo 6 dígitos';
     this.submited = true;
     return;
   }

   this.user.created = new Date();


   this.authService.register(this.user).subscribe({
     next: (d)=>{
       this.saveSuccess = true;
       this.submited = false;
       this.errorSave = false;
       console.log('registered')
       console.log(d)
     },
     error: (e)=>{
       this.message = 'Al parecer este correo ya se encuentra registrado. Ponte en contacto con Megapro para obtener información.'
       this.submited = true;
       this.errorSave = true;
     }
   })

  }

}
