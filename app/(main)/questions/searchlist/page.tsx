'use client';
import { QuestionsService } from '../../../../service/QuestionsService';
import { Button } from 'primereact/button';
import { DataScroller } from 'primereact/datascroller';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Toolbar } from 'primereact/toolbar';

import { Tag } from 'primereact/tag';

const QuestioSearchList = () => {
    const [MCQ, setMCQ] = useState<Questions.MCQ[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        QuestionsService.getMCQ().then((data) => {
            setMCQ(data);
            setLoading(false);
        });

    }, []);
    const formatDate = (value: Date | undefined) => {
        if(value == undefined)
            return "";
  
        var datevalue = new Date(value);
        return isNaN(datevalue.valueOf()) ? "": datevalue.toLocaleDateString('en-SG');
    };
    const itemTemplate = (rowData: Questions.MCQ) => {

        const topics = rowData.topics.map((topic) =>
            <Tag severity="info" value={topic.name}></Tag>
        )
        const skills = rowData.skills.map((skills) =>
            <Tag value={skills.name}></Tag>
        )
        return (
        <div className='card mb-1'>
            <div className="grid" key={rowData.id}>
                    <div className="col-12">{rowData.stem}</div>
                    <div className="col-12 md:col-6"><label>Topics:</label>{topics}</div>
                    <div className="col-12 md:col-6"><label>Skills:</label>{skills}</div>
                    <div className="col-12 md:col-3"><label>Status:</label>{rowData.status}</div>
                    <div className="col-12 md:col-3"><label>Publised on:</label>{formatDate(rowData.published_on)}</div>
                    <div className="col-12 md:col-6"><label>Publised by:</label>{rowData.published_by}</div>
                    <div className="col-12 md:col-10">&nbsp;</div>
                    <div className="col-12 md:col-2">
                        <span></span>
                        <Button icon="pi pi-pencil" rounded text/>
                        <Button icon="pi pi-trash" rounded severity="danger" text />
                    </div>
            </div>
        </div>
        );
    }

    const startContent = (
        <React.Fragment>
            <Link href="/questions/edit"><Button icon="pi pi-plus" className="mr-2"  /></Link>
            <Button icon="pi pi-print" className="mr-2" />
            <Button icon="pi pi-upload" />
        </React.Fragment>
    );
    return (
        <div className="grid nested-grid">
            <div className="col-12">
                <div className="card">
                    <Toolbar start={startContent} />
                    <h5>List of Questions</h5>
                    <DataScroller value={MCQ} itemTemplate={itemTemplate} rows={5} buffer={0.4}>
                    </DataScroller>
                </div>
            </div>

        </div>
    );
};

export default QuestioSearchList;
