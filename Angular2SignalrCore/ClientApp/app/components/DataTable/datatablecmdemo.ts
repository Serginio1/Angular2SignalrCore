import {Component,OnInit} from '@angular/core';
import {Car} from './car';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Component({
    selector: 'mydatatable',
    template: require('./datatablecmdemo.html')
})
export class DataTableCMDemo implements OnInit {

    selectedCar: Car;
    cars: Car[] = [
        { brand: "VW", year: 2012, "color": "Orange", "vin": "Первый" },
        { brand: "Audi", "year": 2011, "color": "Black", "vin": "Второй" },
        { brand: "Renault", "year": 2005, "color": "Gray", "vin": "Третий" },
        { brand: "BMW", "year": 2003, "color": "Blue", "vin": "j6w54qgh" },
        { brand: "Mercedes", "year": 1995, "color": "Orange", "vin": "hrtwy34" },
        { brand: "Volvo", "year": 2005, "color": "Black", "vin": "jejtyj" },
        { brand: "Honda", "year": 2012, "color": "Yellow", "vin": "g43gr" },
        { brand: "Jaguar", "year": 2013, "color": "Orange", "vin": "greg34" },
        { brand: "Ford", "year": 2000, "color": "Black", "vin": "h54hw5" },
        { brand: "Fiat", "year": 2013, "color": "Red", "vin": "245t2s" }
    ];


    
    


    constructor(private http:Http) { }

    ngOnInit() {
        //this.http.get('http://www.primefaces.org/primeng/showcase/resources/data/cars-small.json')
        //    .map(res => <Car[]>res.json().data)
        //    .subscribe(data => { this.cars= data; }); 
        
        
    }

   

    
}