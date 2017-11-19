
const CYCLE_STROKE = '#2d91a3';

const TASK_FILL = 'lightblue';
const TASK_STROKE = 'darkblue';

const LINK_COLOR = 'black';
const LINK_LAG_COLOR = 'green';

export class CycleVisual {
    stroke: string = CYCLE_STROKE;
}

export class TaskVisual {
    ind: number = 0;
    fill: string = TASK_FILL;
    stroke: string = TASK_STROKE;
}

export class LinkVisual {
    color: string = LINK_COLOR;
    lagColor: string = LINK_LAG_COLOR;
}
