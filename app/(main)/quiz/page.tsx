import React from 'react';
import { Button } from 'primereact/button';
import { MegaMenu } from 'primereact/megamenu';
import { SplitButton } from 'primereact/splitbutton';

const items = [
    {
        label: 'Delete',
        icon: 'pi pi-times'
    }
];

const megamenuItems = [
    {
      label: 'States of Matter',
      icon: 'pi pi-fw pi-asterisk', // Use a generic icon for categories
      items: [
        [
          {
            label: 'Solids',
            items: [
              { label: 'Crystal Structures' },
              { label: 'Intermolecular Forces' },
            ],
          },
          {
            label: 'Liquids',
            items: [{ label: 'Intermolecular Interactions' }, { label: 'Viscosity' }],
          },
        ],
        [
          {
            label: 'Gases',
            items: [
              { label: 'Kinetic Molecular Theory' },
              { label: 'Ideal Gas Law' },
            ],
          },
          {
            label: 'Phase Changes',
            items: [{ label: 'Melting Point' }, { label: 'Boiling Point' }],
          },
        ],
      ],
    },
    {
      label: 'Atomic Structure',
      icon: 'pi pi-fw pi-atom',
      items: [
        [
          {
            label: 'Elements',
            items: [{ label: 'Periodic Table' }, { label: 'Electron Configuration' }],
          },
          {
            label: 'Atoms',
            items: [{ label: 'Subatomic Particles' }, { label: 'Atomic Number & Mass' }],
          },
        ],
        [
          {
            label: 'Isotopes',
            items: [{ label: 'Radioactivity' }, { label: 'Nuclear Stability' }],
          },
        ],
      ],
    },
    {
      label: 'Chemical Reactions',
      icon: 'pi pi-fw pi-beaker',
      items: [
        [
          {
            label: 'Types of Reactions',
            items: [
              { label: 'Combination' },
              { label: 'Decomposition' },
              { label: 'Single Replacement' },
              { label: 'Double Replacement' },
            ],
          },
          {
            label: 'Balancing Equations',
            items: [{ label: 'Stoichiometry' }, { label: 'Limiting Reagents' }],
          },
        ],
        [
          {
            label: 'Energy Changes',
            items: [{ label: 'Enthalpy' }, { label: 'Exothermic & Endothermic' }],
          },
        ],
      ],
    },
    {
      label: 'Solutions',
      icon: 'pi pi-fw pi-flask',
      items: [
        [
          {
            label: 'Concentration',
            items: [
              { label: 'Molarity' },
              { label: 'Molality' },
              { label: 'Dilution' },
            ],
          },
          {
            label: 'Solutes & Solvents',
            items: [{ label: 'Types of Solutions' }, { label: 'Solubility' }],
          },
        ],
        [
          {
            label: 'Colligative Properties',
            items: [
              { label: 'Boiling Point Elevation' },
              { label: 'Freezing Point Depression' },
              { label: 'Osmosis' },
            ],
          },
        ],
      ],
    },
    {
        label: 'Organic Chemistry',
        icon: 'pi pi-fw pi-dna', // Use a DNA icon for Organic Chemistry
        items: [
          [
            {
              label: 'Functional Groups',
              items: [
                { label: 'Hydrocarbons (Alkanes, Alkenes, Alkynes)' },
                { label: 'Haloalkanes' },
                { label: 'Alcohols' },
                { label: 'Ethers' },
              ],
            },
            {
              label: 'Isomers',
              items: [{ label: 'Structural Isomers' }, { label: 'Stereoisomers' }],
            },
          ],
          [
            {
              label: 'Chemical Reactions',
              items: [
                { label: 'Combustion Reactions' },
                { label: 'Substitution Reactions' },
                { label: 'Addition Reactions' },
                { label: 'Elimination Reactions' },
              ],
            },
            {
              label: 'Naming Organic Compounds',
              items: [
                { label: 'IUPAC Nomenclature' },
                { label: 'Common Names' },
              ],
            },
          ],
        ],
      },
      {
        label: 'Acids and Bases',
        icon: 'pi pi-fw pi-balance', // Use a balance icon for Acids and Bases
        items: [
          [
            {
              label: 'Brønsted-Lowry Theory',
              items: [{ label: 'Conjugate Acid-Base Pairs' }, { label: 'Strength of Acids & Bases' }],
            },
            {
              label: 'Lewis Theory',
              items: [{ label: 'Electron Donors & Acceptors' }, { label: 'Lewis Acids & Bases' }],
            },
          ],
          [
            {
              label: 'pH',
              items: [{ label: 'Definition and Scale' }, { label: 'Calculations' }],
            },
            {
              label: 'Indicators',
              items: [{ label: 'Types of Indicators' }, { label: 'Acid-Base Titrations' }],
            },
          ],
        ],
      },
  ];
  

const EmptyPage = () => {
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Take Quiz</h5>
                    <p>Use this page to start from scratch and place your custom content.</p>
                    <div className="card">
                    <h5>Select Topic</h5>
                    <div className="col-12 md:col-8">
                    <div className="card">
                    <h5>Chemistry Topics</h5>
                    <MegaMenu model={megamenuItems} orientation="vertical" breakpoint="767px" />
                    <div style={{ marginTop: '1.55em' }} className="flex flex-wrap gap-2">
                        <SplitButton label="Crystal Structures" icon="pi pi-check" model={items}></SplitButton>
                        <SplitButton label="Periodic Table" icon="pi pi-check" model={items}></SplitButton>
                        <SplitButton label="Combination" icon="pi pi-check" model={items}></SplitButton>
                        <SplitButton label="Molarity" icon="pi pi-check" model={items}></SplitButton>
                        {/* <SplitButton label="Conjugate Acid-Base Pairs" icon="pi pi-check" model={items}></SplitButton> */}
                    </div>
                    </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button label="Submit"></Button>
                        <Button label="Disabled" disabled></Button>
                        {/* <Button label="Link" link></Button> */}
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
};

export default EmptyPage;
