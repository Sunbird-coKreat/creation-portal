import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramsService, DataService, FrameworkService, ActionService } from '@sunbird/core';
import { ProjectFilterComponent } from './project-filter.component';
import { programData } from './project-filter.component.spec.data';
xdescribe('ProjectFilterComponent', () => {
  let component: ProjectFilterComponent;
  let fixture: ComponentFixture<ProjectFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectFilterComponent],
      providers: [ProgramsService, DataService, FrameworkService, ActionService,]
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
    expect(component.showFilters['sourcingOrganisations']).toBeFalsy();
    expect(component.showFilters['nominations']).toBeFalsy();
    expect(component.showFilters['contributions']).toBeFalsy();
    expect(component.getFiltersUnionFromList()).toHaveBeenCalled();
    expect(component.getAppliedFiltersDetails()).toHaveBeenCalled();
  });
  it('should get filters union from list of programs ', () => {
    component.programs = programData.programs;
    component.getFiltersUnionFromList();
    expect(component.currentFilters['gradeLevel']).toEqual(programData.applyFilters.filterGradeLevel);
    expect(component.currentFilters['contentTypes']).toEqual(programData.applyFilters.filterContentTypes);
    expect(component.currentFilters['medium']).toEqual(programData.applyFilters.filterMedium);
    expect(component.currentFilters['subject']).toEqual(programData.applyFilters.filterSubject);
  });
  it('should get details about applied filters', () => {
    component.getAppliedFiltersDetails();
    expect(component.getAppliedFiltersDetails()).toHaveBeenCalled();
    expect(component.setPreferences['gradeLevel']).toEqual(programData.applyFilters.filterGradeLevel);
    expect(component.setPreferences['contentTypes']).toEqual(programData.applyFilters.filterContentTypes);
    expect(component.setPreferences['medium']).toEqual(programData.applyFilters.filterMedium);
    expect(component.setPreferences['subject']).toEqual(programData.applyFilters.filterSubject);
    expect(component.filtersAppliedCount).toEqual(4);
  });
  it('should applie filters when user clicks on appy buuton', () => {
    component.applyFilter();
    expect(component.setAppliedFilters(programData.applyFilters)).toHaveBeenCalled();
    expect(component.getAppliedFiltersDetails()).toHaveBeenCalled();
    expect(component.programs).toEqual(programData.programs);
  });

  it('should reset filters when user clicks on reset buuton', () => {
    component.applyFilter('reseFiltert');
    expect(component.setAppliedFilters({})).toHaveBeenCalled();
    expect(component.getAppliedFiltersDetails()).toHaveBeenCalled();
    expect(component.programs).toEqual(programData.programs);
  });
  it('should set filters based on selected filters ', () => {
    component.setAppliedFilters(programData.applyFilters);
    expect(component.setAppliedFilters({})).toHaveBeenCalled();
  });
  it('should show filters for my projects tab for sourcing user other than sourcing org ', () => {
    component.checkFilterShowCondition();
    expect(component.showFilters['sourcingOrganisations']).toBeFalsy();
    expect(component.showFilters['nominations']).toBeFalsy();
    expect(component.showFilters['contributions']).toBeFalsy();
  });
});
