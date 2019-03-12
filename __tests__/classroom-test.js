import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';
import App from '../App';
import renderer from 'react-test-renderer';
import NavigationTestUtils from 'react-navigation/NavigationTestUtils';
import Classroom from '../screens/Classroom/Classroom';
import ClusterWS from 'clusterws-client-js';
import { Socket } from 'net';

describe('addition',()=> {
    it('knows 2 + 2 equal 4', () => {
        expect(2+2).toBe(4);
    })
})

describe('my classroom',()=> {
    let navigation;
    let channel;
    this.socket = new ClusterWS({
        url: 'wss://temp-vocacoord.herokuapp.com/'
      });
    socket.on('connect', () => {
        channel = socket.subscribe('AAAA')
    })
    beforeEach(() => {
        navigation = { getParam: () => "channel" } 

    })
    it('it renders', () => {
        const tree = renderer
        .create(<Classroom navigation={navigation} channel={channel} />)
        .toJSON();
        expect(tree).toMatchSnapshot();
    })
})
