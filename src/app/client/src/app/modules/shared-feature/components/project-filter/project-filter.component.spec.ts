import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFilterComponent } from './project-filter.component';

describe('ProjectFilterComponent', () => {
  let component: ProjectFilterComponent;
  let fixture: ComponentFixture<ProjectFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
    // “My Projects” page filters for contributor (individual or contrib org), reviewer (of contrib org or sourcing org) 
  // Medium, Class, Subject, Content Type - All these filters are multi-select. Union of all the values from all “My Projects”.
  it('should show filters for my projects tab for contributor user ', () => {
    component.activeMyProgramsMenu = true;
    component.checkFilterShowCondition();
    expect(component.showFiltersModal).toBeTruthy();
    expect(component.showFilters['sourcingOrganisations']).toBeFalsy();
    expect(component.showFilters['nominations']).toBeFalsy();
    expect(component.showFilters['contributions']).toBeFalsy();
    expect(component.getFiltersUnionFromList()).toHaveBeenCalled();
    expect(component.getAppliedFiltersDetails()).toHaveBeenCalled();
});
it('should get filters union from list of programs ', () => {
  component.programs = programData.programs;
  component.getFiltersUnionFromList();
  expect(component.currentFilters['gradeLevel']).toEqual(programData.gradeLevel);
  expect(component.currentFilters['contentTypes']).toEqual(programData.contentTypes);
  expect(component.currentFilters['medium']).toEqual(programData.medium);
  expect(component.currentFilters['subject']).toEqual(programData.subject);
});
it('should get details about applied filters', () => {
  component.getAppliedFiltersDetails();
  expect(component.programsService.getAppliedFiltersDetails()).toHaveBeenCalled();
  expect(component.appliedFilters['gradeLevel']).toEqual(programData.gradeLevel);
  expect(component.appliedFilters['contentTypes']).toEqual(programData.contentTypes);
  expect(component.appliedFilters['medium']).toEqual(programData.medium);
  expect(component.appliedFilters['subject']).toEqual(programData.subject);
  expect(component.filtersAppliedCount).toEqual(4);
});
it('should applie filters when user clicks on appy buuton', () => {
 component.applyFilter();
 expect(component.setAppliedFilters()).toHaveBeenCalled();
 expect(component.getAppliedFiltersDetails()).toHaveBeenCalled();
 expect(component.getContributionProgramList()).toHaveBeenCalled();
 expect(component.programs).toEqual(programData.programs);
});
it('should get error while appling filters when user clicks on appy buuton', () => {
  component.applyFilter();
  expect(component.setAppliedFilters()).toHaveBeenCalled();
  expect(component.toasterService.error()).toHaveBeenCalledWith('error while appling filers');
 });
 it('should reset filters when user clicks on reset buuton', () => {
  component.resetFilter();
  expect(component.setAppliedFilters()).toHaveBeenCalled();
  expect(component.getAppliedFiltersDetails()).toHaveBeenCalled();
  expect(component.getContributionProgramList()).toHaveBeenCalled();
  expect(component.programs).toEqual(programData.programs);
 });
 it('should get error while resetting filters when user clicks on reset buuton', () => {
   component.resetFilter();
   expect(component.setAppliedFilters()).toHaveBeenCalled();
   expect(component.toasterService.error()).toHaveBeenCalledWith('error while resetting filers');
  });
  it('should set filters based on selected filters ', () => {
    component.setAppliedFilters();
    expect(component.programsService.setAppliedFilters()).toHaveBeenCalled();
  });
  it('should set filters based on selected filters and got error  ', () => {
    component.setAppliedFilters();
    expect(component.programsService.setAppliedFilters()).toHaveBeenCalled();
   expect(component.toasterService.error()).toHaveBeenCalledWith('error while setting filers');

  });
it('should show filters for my projects tab for sourcing user other than sourcing org ', () => {
    component.checkFilterShowCondition();
    expect(component.showFiltersModal).toBeTruthy();
    expect(component.showFilters['sourcingOrganisations']).toBeFalsy();
    expect(component.showFilters['nominations']).toBeFalsy();
    expect(component.showFilters['contributions']).toBeFalsy();
});
});
