'use client';
import { QuestionsService } from '../../../../service/QuestionsService';
import React, { useEffect, useState, useRef, use } from 'react';
import Link from 'next/link';
import { Button } from 'primereact/button';
import { DataScroller } from 'primereact/datascroller';
import { Toolbar } from 'primereact/toolbar';
import { Tag } from 'primereact/tag';
import { Editor } from 'primereact/editor';
import { TreeSelect, TreeSelectSelectionKeysType } from 'primereact/treeselect';
import { TreeNode } from 'primereact/treenode';
import './searchlist.css'; // Custom styles

const DEFAULT_PAGE_SIZE = 5;
const QuestionSearchList = () => {
    const [MCQ, setMCQ] = useState<Questions.MCQ[]>([]);
    const [loading, setLoading] = useState(false); // what is this for
    const [totalPages, setTotalPages] = useState(0);
    const [dataScrollerRow, setDataScrollerRow] = useState(0);
    const [selectedTopicNodes, setSelectedTopicNodes] = useState<string | TreeSelectSelectionKeysType | TreeSelectSelectionKeysType[] | null>();
    const [topicNodes, setTopicNodes] = useState<TreeNode[]>([]);
    const [retrieveMCQRequest, setRetrieveMCQRequest] = useState<Questions.RetrieveQuestionRequest>({ pageNumber: 0, pageSize: DEFAULT_PAGE_SIZE });
    const [search, toggleSearch] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);

    useEffect(() => {
        QuestionsService.getTopics().then((topics) => {
            var nodes = topics.map((topic) => {
                let childnode: any[] = [];
                if (topic.skills) {
                    childnode = topic.skills.map((skill) => {
                        return { key: topic.id + '-' + skill.id, label: skill.name, data: { id: skill.id, name: skill.name, type: 'skill', topicId: topic.id } };
                    });
                }
                return { key: topic.id, label: topic.name, data: { id: topic.id, name: topic.name, type: 'topic' }, children: childnode };
            });
            setTopicNodes(nodes);
        });
    }, []);
    //lazing load when scrolling
    useEffect(() => {
        if (loading) return;
        setLoading(true);
        //console.log('dataScrollerRow:', dataScrollerRow);
        //console.log("calPage", Math.floor(dataScrollerRow / DEFAULT_PAGE_SIZE));
        var currentPage = retrieveMCQRequest.pageNumber || 0;
        var loadPage = currentPage;
        if (Math.floor(dataScrollerRow / DEFAULT_PAGE_SIZE) > currentPage) {
            //load next page
            loadPage++;
        }
        if (currentPage != 0 && loadPage != 0 && (loadPage >= totalPages || loadPage <= currentPage)) {
            setLoading(false);
            return;
        }
        //console.log('load data current page', loadPage);
        retrieveMCQRequest.pageNumber = loadPage;
        QuestionsService.retrieveMCQ(retrieveMCQRequest)
            .then((data) => {
                //console.log('MCQ', data.mcqs);
                setMCQ([...MCQ, ...data.mcqs]);
                setTotalPages(data.totalPages || 0);
                setRetrieveMCQRequest(retrieveMCQRequest);
                setTotalRecords(data.totalRecords || 0);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [dataScrollerRow]);
    //when click search
    useEffect(() => {
        QuestionsService.retrieveMCQ(retrieveMCQRequest)
            .then((data) => {
                //console.log('MCQ', data.mcqs);
                setMCQ(data.mcqs);
                setTotalPages(data.totalPages || 0);
                setRetrieveMCQRequest(retrieveMCQRequest);
                setTotalRecords(data.totalRecords || 0);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [search]);

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
                            <Button icon="pi pi-pencil" size="large" rounded text />
                        </Link>
                        {/* <Button icon="pi pi-trash" size='large' rounded severity="danger" text /> */}
                    </div>
                </div>
            </div>
        );
    };
    const handleOnSearch = () => {
        //populate skills for mcq
        let selectedSkills: number[] = [];

        if (selectedTopicNodes) {
            Object.entries(selectedTopicNodes).forEach(([key, data]) => {
                //console.log('key', key, 'data', data);
                let topic_skill = key.split('-');
                if (topic_skill.length > 1) {
                    selectedSkills.push(parseInt(topic_skill[1]));
                }
            });
        }
        retrieveMCQRequest.skills = selectedSkills;
        retrieveMCQRequest.pageNumber = 0;
        setRetrieveMCQRequest(retrieveMCQRequest);
        toggleSearch(!search);
    };
    const startContent = (
        <React.Fragment>
            <div className="grid">
                <Link href="/questions/create">
                    <Button icon="pi pi-plus" className="mr-2" />
                </Link>
                <div className="flex stretch">
                    <TreeSelect
                        style={{ width: '30rem', maxWidth: '100%' }}
                        value={selectedTopicNodes}
                        onChange={(e) => setSelectedTopicNodes(e.value)}
                        options={topicNodes}
                        metaKeySelection={false}
                        selectionMode="checkbox"
                        display="chip"
                        placeholder="Select Topics / Skills"
                        showClear
                    />
                    <Button icon="pi pi-search" className="ml-2 mr-2" onClick={() => handleOnSearch()} />
                </div>
            </div>
        </React.Fragment>
    );

    return (
        <div className="grid nested-grid">
            <div className="col-12">
                <div className="card">
                    <Toolbar start={startContent} />
                    <h5>Questions ({totalRecords} records)</h5>

                    <DataScroller
                        value={MCQ}
                        itemTemplate={itemTemplate}
                        rows={DEFAULT_PAGE_SIZE}
                        buffer={0.9}
                        lazy
                        onLazyLoad={(e) => {
                            setDataScrollerRow(e.first);
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default QuestionSearchList;
