'use client';
import { QuestionsService } from '../../../../service/QuestionsService';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column, ColumnFilterApplyTemplateOptions, ColumnFilterClearTemplateOptions, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { DataTable,  DataTableFilterMeta } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { Tag } from 'primereact/tag';

const QuestioSearchList = () => {
    const [MCQ, setMCQ] = useState<Questions.MCQ[]>([]);
    const [filters1, setFilters1] = useState<DataTableFilterMeta>({});
    const [loading, setLoading] = useState(true);
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');

    const clearFilter1 = () => {
        initFilters1();
    };

    const onGlobalFilterChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters1 = { ...filters1 };
        (_filters1['global'] as any).value = value;

        setFilters1(_filters1);
        setGlobalFilterValue1(value);
    };

    const renderHeader1 = () => {
        return (
            <div className="flex justify-content-between">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Keyword Search" />
                </span>
                <Link href="/questions/edit"><Button type="button" icon="pi pi-plus" label="New"  onClick={clearFilter1} /></Link>
            </div>
        );
    };

    useEffect(() => {
        QuestionsService.getMCQ().then((data) => {
            setMCQ(data);
            setLoading(false);
        });

        initFilters1();
    }, []);


    const formatDate = (value: Date) => {
        return value.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const initFilters1 = () => {
        setFilters1({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            stem: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            'topics.name': {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            'skilss.name': {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },            
            publish_on: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
            }
        });
        setGlobalFilterValue1('');
    };


    const filterClearTemplate = (options: ColumnFilterClearTemplateOptions) => {
        return <Button type="button" icon="pi pi-times" onClick={options.filterClearCallback} severity="secondary"></Button>;
    };

    const filterApplyTemplate = (options: ColumnFilterApplyTemplateOptions) => {
        return <Button type="button" icon="pi pi-check" onClick={options.filterApplyCallback} severity="success"></Button>;
    };

    const dateBodyTemplate = (rowData: Questions.MCQ) => {
        return formatDate(rowData.publish_on);
    };

    const dateFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };

    const topicsBodyTemplate = (rowData: Questions.MCQ) => {
        const content1 = rowData.topics.map((topic) =>
            <Tag severity="info" value={topic.name}></Tag>
        )
        return (<div className="flex flex-wrap gap-2">
                {content1}
        </div>);
    }

    const skillsBodyTemplate = (rowData: Questions.MCQ) => {
        const content2 = rowData.skills.map((skill) =>
            <Tag value={skill.name}></Tag>
        )
        return (<div className="flex flex-wrap gap-2">
                {content2}
        </div>);
    }

    const actionBodyTemplate = (rowData: Questions.MCQ) => {
        return (
        <div className="flex flex-wrap gap-2">
            <span></span>
            <Button icon="pi pi-pencil" rounded text/>
            <Button icon="pi pi-trash" rounded severity="danger" text />
        </div>
        );
    }

    const onClickNew = () => {

    }
    const header1 = renderHeader1();

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Questions</h5>
                    <DataTable
                        value={MCQ}
                        paginator
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={10}
                        dataKey="id"
                        filters={filters1}
                        filterDisplay="menu"
                        loading={loading}
                        responsiveLayout="scroll"
                        emptyMessage="No MCQ found."
                        header={header1}
                    >
                        <Column field="stem" header="Stem" filter filterPlaceholder="Search by question" style={{ minWidth: '12rem' }} />
                        <Column header="Topics"  style={{ minWidth: '12rem' }} body={topicsBodyTemplate}/>
                        <Column header="Skills"  style={{ minWidth: '12rem' }} body={skillsBodyTemplate}/>
                        <Column field="publish_on" filterField="publish_on" header="Publish On" dataType="date" style={{ minWidth: '12rem' }} filter filterElement={dateFilterTemplate}/>
                        <Column header="Actions" style={{ minWidth: '10rem' }} field="id" body={actionBodyTemplate} />
                    </DataTable>
                </div>
            </div>

        </div>
    );
};

export default QuestioSearchList;
