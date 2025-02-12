import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { IonHeader, IonToolbar, IonTitle } from "@ionic/angular/standalone";
import { PlaceModel } from 'src/app/places/place.model';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
  standalone: false,
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace?: PlaceModel;
  @Input() selectedMode?: 'selected' | 'random';
  @ViewChild('f', { static: true }) form?: NgForm;
  startDate: string = '';
  endDate: string = '';
  startDateCtrl: string = '';

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    const availableFrom = new Date(this.selectedPlace?.availableFrom!);
    const availableTo = new Date(this.selectedPlace?.availableTo!);
    if (this.selectedMode === 'random') {
      this.startDate = new Date(
        availableFrom.getTime() + Math.random() * (availableTo.getTime() - 7 * 24 * 60 * 60 * 1000 - availableFrom.getTime())
      ).toISOString();
      this.endDate = new Date(
        new Date(this.startDate).getTime() + Math.random() * (new Date(this.startDate).getTime() + 6 * 24 * 60 * 60 * 100 - new Date(this.startDate).getTime())
      ).toISOString();
    }
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
  onBookPlace() {
    if (this.form?.invalid || !this.datesValid()) {
      return;
    }
    this.modalCtrl.dismiss({
      bookingData: {
        firstName: this.form?.value['first-name'],
        lastName: this.form?.value['last-name'],
        guestNumber: this.form?.value['guest-number'],
        startDate: new Date(this.form?.value['date-from']),
        endDate: new Date(this.form?.value['date-to']),
      }
    }, 'confirm');
  }

  datesValid() {
    const startDate = new Date(this.form?.value['date-from']);
    const endDate = new Date(this.form?.value['date-to']);
    return endDate > startDate;
  }
}
