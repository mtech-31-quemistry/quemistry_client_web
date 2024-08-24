'use client';
import { QuestionsService } from '../../../../service/QuestionsService';
import { Button } from 'primereact/button';
import { DataScroller } from 'primereact/datascroller';
import React, { useEffect, useState, createContext, useContext } from 'react';
import Link from 'next/link';
import { Toolbar } from 'primereact/toolbar';
import { Tag } from 'primereact/tag';
import { Editor } from 'primereact/editor';
import './searchlist.css'; // Custom styles
import { QuestionProvider } from '../context/QuestionContext';
import { useQuestion } from '../context/QuestionContext';

const QuestioSearchList = () => {
    return (
        <QuestionProvider>
            <QuestioSearchListChild />
        </QuestionProvider>
    );
};

const QuestioSearchListChild = () => {
    const [MCQ, setMCQ] = useState<Questions.MCQ[]>([]);
    const [loading, setLoading] = useState(true); // what is this for

    const { setQuestion } = useQuestion();

    const handleClickEdit = (selectedQuestion: Questions.MCQ) => {
        setQuestion(selectedQuestion);
        console.log('question selected', selectedQuestion);
    };

    useEffect(() => {
        const retrieveQuestionRequest: Questions.RetrieveQuestionRequest = {
            pageNumber: 0,
            pageSize: 10
        };
        QuestionsService.retrieveMCQ(retrieveQuestionRequest)
            .then((data) => {
                setMCQ(data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    // useEffect(() => {
    //     QuestionsService.getMCQ().then((data) => {
    //         setMCQ(data);
    //         setLoading(false);
    //     }).catch(()=>{
    //         setLoading(false);
    //     });
    // }, []);
    const formatDate = (value: Date | undefined) => {
        if (value == undefined) return '';

        var datevalue = new Date(value);
        return isNaN(datevalue.valueOf()) ? '' : datevalue.toLocaleDateString('en-SG');
    };
    const itemTemplate = (rowData: Questions.MCQ) => {
        const topics = rowData.topics.map((topic) => <Tag style={{ marginRight: '1em' }} severity="info" value={topic.name} key={topic.id}></Tag>);
        const skills = rowData.skills.map((skills) => <Tag style={{ marginRight: '1em' }} value={skills.name} key={skills.id}></Tag>);
        return (
            <div className="card mb-1">
                <div className="grid" key={rowData.id}>
                    {/* <div className="col-12">{rowData.stem}</div>  */}
                    <div className="col-12" style={{ margin: 0, padding: 0 }}>
                        <Editor value={rowData.stem} showHeader={false} readOnly style={{ border: 0 }} />
                    </div>
                    <div className="col-12 md:col-6">
                        <label>Topics: </label>
                        {topics}
                    </div>
                    <div className="col-12 md:col-6">
                        <label>Skills: </label>
                        {skills}
                    </div>
                    <div className="col-12 md:col-3">
                        <label>Status: </label>
                        {rowData.status}
                    </div>
                    <div className="col-12 md:col-3">
                        <label>Created on: </label>
                        {formatDate(rowData.createdOn)}
                    </div>
                    <div className="col-12 md:col-6">
                        <label>Created by: </label>
                        {rowData.createdBy}
                    </div>
                    <div className="col-12 md:col-10">&nbsp;</div>
                    <div className="col-12 md:col-2">
                        <span></span>
                        {/* <Link href="/questions/edit"><Button icon="pi pi-pencil" rounded text/></Link> */}
                        <Link href={`/questions/edit?id=${rowData.id}`} passHref>
                            <Button icon="pi pi-pencil" rounded text onClick={() => handleClickEdit(rowData)} />
                        </Link>
                        <Button icon="pi pi-trash" rounded severity="danger" text />
                    </div>
                </div>
            </div>
        );
    };

    const startContent = (
        <React.Fragment>
            <Link href="/questions/create">
                <Button icon="pi pi-plus" className="mr-2" />
            </Link>
            <Button icon="pi pi-upload" />
        </React.Fragment>
    );
    return (
        <div className="grid nested-grid">
            <div className="col-12">
                <div className="card">
                    <Toolbar start={startContent} />
                    <h5>List of Questions</h5>
                    <DataScroller value={MCQ} itemTemplate={itemTemplate} rows={5} buffer={0.4}></DataScroller>
                </div>
            </div>
        </div>
    );
};

export default QuestioSearchList;
