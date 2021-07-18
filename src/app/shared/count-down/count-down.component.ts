import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription, interval } from 'rxjs';

@Component({
    selector: 'app-count-down',
    templateUrl: './count-down.component.html',
    styleUrls: ['./count-down.component.css']
})
export class CountDownComponent implements OnInit, OnDestroy {

    private subscription: Subscription;

    @Input()
    public endDate: number;


    public days: number | string;
    public hours: number | string;
    public minutes: number | string;
    public seconds: number | string;

    getIntervalTime() {
        let intervalTime: number = Math.floor((this.endDate - Date.now()) / 1000);
        return this.getTime(intervalTime);
    }

    private getTime(time: number) {

        this.days = Math.floor(time / 86400);
        time -= this.days * 86400;
        this.days = this.makeMeTwoDigits(this.days);

        this.hours = Math.floor(time / 3600) % 24;
        time -= this.hours * 3600;
        this.hours = this.makeMeTwoDigits(this.hours);

        this.minutes = Math.floor(time / 60) % 60;
        time -= this.minutes * 60;
        this.minutes = this.makeMeTwoDigits(this.minutes);

        this.seconds = time % 60;
        this.seconds = this.makeMeTwoDigits(this.seconds);

    }

    private makeMeTwoDigits(n: number) {
        return (n < 10 ? "0" : "") + n;
    }


    ngOnInit() {
        this.subscription = interval(1000)
            .subscribe(x => { this.getIntervalTime(); });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}