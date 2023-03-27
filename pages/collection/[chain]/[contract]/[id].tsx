import React from 'react'
import { useRouter } from 'next/router'
import LaunchHeroSection from 'components/launch/LaunchHeroSection'
// import CardImage from "../../public/temp.png"
import Image from 'next/image'
import * as Avatar from '@radix-ui/react-avatar'
import * as Tooltip from '@radix-ui/react-tooltip'
import Layout from 'components/Layout'
import * as Tabs from '@radix-ui/react-tabs'

import '@radix-ui/colors/blackA.css'
import '@radix-ui/colors/green.css'
import '@radix-ui/colors/mauve.css'
import '@radix-ui/colors/violet.css'
export default function getRoute() {
  // Calling useRouter() hook
  const router = useRouter()

  console.log(router.query)
  return (
    <Layout>
      {/* <LaunchHeroSection /> */}
      <div style={{ background: 'white', height: '90vh', display: 'flex' }}>
        <img
          src="/temp.png"
          alt="generated image"
          className="rounded-xl "
          style={{ width: '60vw', padding: '10px', borderRadius: '50px' }}
        ></img>
        <div style={{ width: '40vw', color: 'black', padding: '20px' }}>
          <h1 style={{ fontSize: '50px', fontWeight: '500' }}>Yoda</h1>
          <div
            style={{
              fontSize: '25px',
              fontWeight: '500',
              paddingTop: '20px',
              paddingBottom: '20px',
            }}
          >
            Balance : 0.01
          </div>
          <div style={{ fontSize: '20px', fontWeight: '500' }}>
            Abstract Art{' '}
          </div>
          <div
            style={{
              fontSize: '20px',
              fontWeight: '500',
              borderRadius: '20px',
            }}
          >
            Ganga Art
          </div>
          <button
            style={{
              fontSize: '20px',
              fontWeight: '500',
              width: '40%',
              height: '40px',
              backgroundColor: '#1773eb',
              color: '#fff',
              borderRadius: '30px',
              marginTop: '20px',
            }}
          >
            {' '}
            Buy
          </button>
          <style jsx global>
            {`
              .TabsRoot {
                display: flex;
                flex-direction: column;
                width: 300px;
                box-shadow: 0 2px 10px var(--blackA4);
              }

              .TabsList {
                flex-shrink: 0;
                display: flex;
                border-bottom: 1px solid var(--mauve6);
              }

              .TabsTrigger {
                font-family: inherit;
                background-color: white;
                padding: 0 20px;
                height: 45px;
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 15px;
                line-height: 1;
                color: var(--mauve11);
                user-select: none;
              }
              .TabsTrigger:first-child {
                border-top-left-radius: 6px;
              }
              .TabsTrigger:last-child {
                border-top-right-radius: 6px;
              }
              .TabsTrigger:hover {
                color: var(--violet11);
              }
              .TabsTrigger[data-state='active'] {
                color: var(--violet11);
                box-shadow: inset 0 -1px 0 0 currentColor,
                  0 1px 0 0 currentColor;
              }
              .TabsTrigger:focus {
                position: relative;
                box-shadow: 0 0 0 2px black;
              }

              .TabsContent {
                flex-grow: 1;
                padding: 20px;
                background-color: white;
                border-bottom-left-radius: 6px;
                border-bottom-right-radius: 6px;
                outline: none;
              }
              .TabsContent:focus {
                box-shadow: 0 0 0 2px black;
              }

              .Text {
                margin-top: 0;
                margin-bottom: 20px;
                color: var(--mauve11);
                font-size: 15px;
                line-height: 1.5;
              }

              .Fieldset {
                margin-bottom: 15px;
                width: 100%;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
              }

              .Label {
                font-size: 13px;
                line-height: 1;
                margin-bottom: 10px;
                color: var(--violet12);
                display: block;
              }

              .Input {
                flex: 1 0 auto;
                border-radius: 4px;
                padding: 0 10px;
                font-size: 15px;
                line-height: 1;
                color: var(--violet11);
                box-shadow: 0 0 0 1px var(--violet7);
                height: 35px;
              }
              .Input:focus {
                box-shadow: 0 0 0 2px var(--violet8);
              }

              .Button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                padding: 0 15px;
                font-size: 15px;
                line-height: 1;
                font-weight: 500;
                height: 35px;
              }
              .Button.green {
                background-color: var(--green4);
                color: var(--green11);
              }
              .Button.green:hover {
                background-color: var(--green5);
              }
              .Button.green:focus {
                box-shadow: 0 0 0 2px var(--green7);
              }
            `}
          </style>
          <Tabs.Root style={{ width: '50%' }} defaultValue="tab1">
            <Tabs.List
              style={{ display: 'flex', justifyContent: 'space-between' }}
              aria-label="Manage your account"
            >
              <Tabs.Trigger className="TabsTrigger" value="tab1">
                OWNER
              </Tabs.Trigger>
              <Tabs.Trigger className="TabsTrigger" value="tab2">
                HISTORY
              </Tabs.Trigger>
              <Tabs.Trigger className="TabsTrigger" value="tab3">
                INFO
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content className="TabsContent" value="tab1">
              <div style={{ display: 'flex' }}>
                <img
                  src="/temp.png"
                  alt="profile"
                  style={{
                    height: '70px',
                    width: '70px',
                    borderRadius: '70px',
                  }}
                />
                <div style={{ color: 'gray' }}>
                  Creator
                  <div>Yoda</div>
                </div>
              </div>
            </Tabs.Content>
            <Tabs.Content className="TabsContent" value="tab2">
              <div style={{ display: 'flex' }}>
                <img
                  src="/temp.png"
                  alt="profile"
                  style={{
                    marginRight: '10px',
                    height: '70px',
                    width: '70px',
                    borderRadius: '70px',
                  }}
                />
                <div>
                  Yoda
                  <div style={{ color: 'gray' }}>The NFT was mineted</div>
                  <div style={{ fontSize: '10px', color: 'gray' }}>
                    2 days ago
                  </div>
                </div>
              </div>
            </Tabs.Content>
            <Tabs.Content className="TabsContent" value="tab3">
              <div>
                <div style={{ fontSize: '14px', color: 'gray' }}>NFT Id</div>
                <div style={{ color: '#1773eb', fontWeight: '500' }}>
                  277842
                </div>
                <div
                  style={{ fontSize: '14px', color: 'gray', marginTop: '10px' }}
                >
                  MINT TRANSACTION
                </div>
                <div style={{ color: '#1773eb', fontWeight: '500' }}>
                  0x3c1ea255...029878afe9
                </div>
                <div
                  style={{ fontSize: '14px', color: 'gray', marginTop: '10px' }}
                >
                  CONTRACT ADDRESS
                </div>
                <div style={{ color: '#1773eb', fontWeight: '500' }}>
                  0xF5db...CdAA4b
                </div>
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </div>
      <div style={{ background: 'white', height: '70vh', color: 'black' }}>
        <p
          style={{
            display: 'block',
            fontSize: '30px',
            fontWeight: '500',
            height: '100px',
            padding: '20px',
          }}
        >
          More By GangaArt
        </p>
        <div
          style={{
            display: 'flex',
            width: '98vw',
            justifyContent: 'space-evenly',
            marginLeft: '10px',
            marginRight: '10px',
          }}
        >
          <div style={{ marginRight: '20px' }}>
            <img
              src="/temp.png"
              alt="profile"
              style={{
                height: '90%',
                width: '100%',
                borderRadius: '20px',
              }}
            />
            <div>a2#1</div>
          </div>

          <div style={{ marginRight: '20px' }}>
            <img
              src="/temp.png"
              alt="profile"
              style={{
                height: '90%',
                width: '100%',
                borderRadius: '20px',
              }}
            />
            <div>a2#1</div>
          </div>
          <div style={{ marginRight: '20px' }}>
            <img
              src="/temp.png"
              alt="profile"
              style={{
                height: '90%',
                width: '100%',
                borderRadius: '20px',
              }}
            />
            <div>a2#1</div>
          </div>
          <div style={{ marginRight: '20px' }}>
            <img
              src="/temp.png"
              alt="profile"
              style={{
                height: '90%',
                width: '100%',
                borderRadius: '20px',
              }}
            />
            <div>a2#1</div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
