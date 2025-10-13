import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, RouterStateSnapshot, ActivatedRoute } from '@angular/router';

// import { PeSumur } from './pe-sumur';
//import { Sonolog } from './sonolog';

@Injectable({
  providedIn: 'root'
})

export class PeSumurService {
  
  constructor(
    private http: HttpClient,
  ) { 
    
  }
}