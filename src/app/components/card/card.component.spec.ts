
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardComponent]
    });
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
 
  it('should emit event when changing page size', () => {
    spyOn(component.parentNavFun, 'emit');

    const newSize = '20';
    component.eventPageSize(newSize);

    expect(component.parentNavFun.emit).toHaveBeenCalledWith({ pageNo: component.pageNo, pageSize: parseInt(newSize) });
  });

  it('should decrease page number in prevHandler', () => {
    component.pageNo = 3;

    spyOn(component.parentNavFun, 'emit');
    component.prevHandler();

    expect(component.pageNo).toBe(2);
    expect(component.parentNavFun.emit).toHaveBeenCalledWith({ pageNo: 2, pageSize: component.pageSize });
  });

  it('should not decrease page number below 1 in prevHandler', () => {
    component.pageNo = 1;

    spyOn(component.parentNavFun, 'emit');
    component.prevHandler();

    expect(component.pageNo).toBe(1);
    expect(component.parentNavFun.emit).toHaveBeenCalledWith({ pageNo: 1, pageSize: component.pageSize });
  });

  it('should increase page number in nextHandler', () => {
    spyOn(component.parentNavFun, 'emit');
    component.nextHandler();

    expect(component.pageNo).toBe(2);
    expect(component.parentNavFun.emit).toHaveBeenCalledWith({ pageNo: 2, pageSize: component.pageSize });
  });

    afterEach(() => {
    fixture.destroy();
  });
});





