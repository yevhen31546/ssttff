import { Title } from '@angular/platform-browser';
import { AlertService } from './../../_services/alert.service';
import { Component, OnInit } from '@angular/core'
import { CritiquesModule } from './critiques.module'
import { CritiquesService } from './critiques.service'
import { LoaderService } from '../../_services/loader.service'

@Component({
  selector: 'app-critiques',
  templateUrl: './critiques.component.html',
  styleUrls: ['./critiques.component.css']
})
export class CritiquesComponent implements OnInit {
  critiques: any = []
  currentPage = 1
  identifyType = 'critique-received'

  constructor(
    private critiqueService: CritiquesService,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private title: Title
  ) {}

  ngOnInit() {
    //this.getCritiques('received')
    this.title.setTitle('Critiques | Shoot The Frame');
  }

  tabChange(event) {
    this.currentPage = 1
    this.critiques = []
    if (event.nextId == 'tab-recieved') {
      this.identifyType = 'critique-received'
    } else {
      this.identifyType = 'critique-given'
    }
  }

  displayAlert(event: any) {
    if (event.type === 'success') {
      this.alertService.success(event.title, event.message);
    } else { ////console.log(event.error,"errorrrr")
      this.alertService.error(event.error.title, event.error.common_error);
    }
  }
}
