import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionProduitComponent } from './edition-produit.component';

describe('EditionProduitComponent', () => {
  let component: EditionProduitComponent;
  let fixture: ComponentFixture<EditionProduitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditionProduitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditionProduitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
