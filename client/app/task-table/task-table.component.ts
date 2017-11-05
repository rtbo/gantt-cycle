import { Component, OnInit } from '@angular/core';
import { CycleService } from '../services/cycle.service';
import { Cycle } from '../cycle';


@Component({
    selector: 'gc-task-table',
    templateUrl: './task-table.component.html',
    styleUrls: ['./task-table.component.css']
})
export class TaskTableComponent implements OnInit {

    constructor(private cycleService: CycleService) {}

    cycle: Cycle;

    ngOnInit() {
        this.cycleService.currentCycleObservable.subscribe(
            (cycle: Cycle) => { this.cycle = cycle; }
        );
    }

}
