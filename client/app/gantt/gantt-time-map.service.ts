import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { CyclePlan } from '../model/cycle';
import { CycleService } from '../model/cycle.service';

const INTER_COEFS = [ 2, 2.5, 2 ]; // 1, 2, 5, 10, 20, 50, ...
const MIN_INTER_GRADS = 40;

const DEFAULT_WIDTH = 800;
const DEFAULT_DURATION = 60;

export class TimeGrad {
    time: number;
    pos: number;
}

export class GanttTimeMap {
    constructor(private _scale: number) {}

    get scale(): number {
        return this._scale;
    }

    timePos(time: number): number {
        return time * this._scale;
    }
    posTime(pos: number): number {
        return pos / this._scale;
    }

}

@Injectable()
export class GanttTimeMapService {

    constructor(private cycleService: CycleService) {
        // have to initialize with valid values, even though they are replaced
        // shortly after
        this._width = DEFAULT_WIDTH;
        this._duration = DEFAULT_DURATION;
        this._mapSubject = new BehaviorSubject(
            new GanttTimeMap(DEFAULT_WIDTH / DEFAULT_DURATION)  // 800 px for 60 time units
        );
        this._gradsSubject = new BehaviorSubject([]);
        this.cycleService.currentPlanChange.subscribe(
            (plan: CyclePlan) => {
                this.plan = plan;
                this.initMap();
            }
        );
    }

    plan: CyclePlan;
    private _width: number;
    private _duration: number;
    private _widthInitialized = false;

    private _mapSubject: BehaviorSubject<GanttTimeMap>;

    private _gradsSubject: BehaviorSubject<TimeGrad[]>;

    get timeMap(): GanttTimeMap {
        return this._mapSubject.value;
    }

    get timeMapChange(): Observable<GanttTimeMap> {
        return this._mapSubject.asObservable();
    }

    get grads(): TimeGrad[] {
        return this._gradsSubject.value;
    }

    get gradsChange(): Observable<TimeGrad[]> {
        return this._gradsSubject.asObservable();
    }

    updateCanvasWidth(width: number) {
        if (width !== this._width) {
            this._width = width;
            this._gradsSubject.next(this.buildGrads());
            if (!this._widthInitialized) {
                this._widthInitialized = true;
                this.initMap();
            }
        }
    }

    zoom(factor: number): void {
        this.updateScale(this.timeMap.scale * factor);
    }

    private initMap() {
        this._duration = Math.max(DEFAULT_DURATION, this.plan.cycleTime);
        this.updateScale(this._width / this._duration);
    }

    private buildGrads(): TimeGrad[] {
        let interG = 1;
        let i = 0;
        while (this.timeMap.timePos(interG) < MIN_INTER_GRADS) {
            interG *= INTER_COEFS[i];
            if (++i === INTER_COEFS.length) {
                i = 0;
            }
        }

        const numGrads = Math.round(1 + this.timeMap.posTime(this._width) / interG);
        const grads: TimeGrad[] = new Array(numGrads);

        for (i=0; i<numGrads; ++i) {
            const t = i * interG;
            grads[i] = {
                time: t, pos: Math.round(this.timeMap.timePos(t))
            };
        }

        return grads;
    }

    private updateScale(scale: number): void {
        if (scale !== this.timeMap.scale) {
            this._mapSubject.next(new GanttTimeMap(scale));
            this._gradsSubject.next(this.buildGrads());
        }
    }
}
