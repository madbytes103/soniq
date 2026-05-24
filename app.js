import { Player } from './src/core/Player.js';
import { StreamHandler } from './src/network/StreamHandler.js';
import { STATIONS } from './src/config/stations.js';
import { PLAYER_STATES } from './src/core/Constants.js';

/**
 * UI Controller / Orchestrator - DEPLOY EDITION
 */
class App {
    constructor() {
        this.player = new Player();
        this.stream = new StreamHandler(this.player);
        this.metadataInterval = null;
        
        this.cacheDOM();
        this.bindEvents();
        this.init();
    }

    cacheDOM() {
        this.btnPlay = document.getElementById('btn-play');
        this.btnStop = document.getElementById('btn-stop');
        this.statusLabel = document.querySelector('#connection-status .label');
        this.stationTitle = document.getElementById('station-title');
        this.stationSubtitle = document.getElementById('station-subtitle');
        this.genreItems = document.querySelectorAll('.nav-item');
        this.volumeSlider = document.getElementById('volume-slider');
        this.currentTrack = document.getElementById('current-track');
        this.currentArtist = document.getElementById('current-artist');
        this.appBody = document.body;
    }

    bindEvents() {
        this.btnPlay.onclick = () => this.stream.play(this.player.currentStation.url);
        this.btnStop.onclick = () => this.stream.stop();
        
        this.genreItems.forEach(item => {
            item.onclick = () => this.handleGenreChange(item.dataset.genre);
        });

        this.volumeSlider.oninput = (e) => this.player.setVolume(e.target.value);

        this.player.on('state_change', (state) => this.handleStateChange(state));
        this.player.on('station_change', (station) => this.updateUIStation(station));
        this.player.on('volume_change', (vol) => this.stream.setVolume(vol));
    }

    handleStateChange(state) {
        const isPlaying = state === PLAYER_STATES.PLAYING;
        this.updateUIState(state);
        if (isPlaying) this.startMetadataPolling();
        else this.stopMetadataPolling();
    }

    init() {
        this.handleGenreChange('ROCK');
        this.player.setVolume(0.8);
    }

    handleGenreChange(genreKey) {
        const station = STATIONS[genreKey];
        if (!station) return;
        this.genreItems.forEach(item => item.classList.toggle('active', item.dataset.genre === genreKey));
        const wasPlaying = this.player.currentState === PLAYER_STATES.PLAYING;
        this.player.setStation(station);
        if (wasPlaying) this.stream.play(station.url);
    }

    startMetadataPolling() {
        this.stopMetadataPolling();
        this.updateMetadata();
        this.metadataInterval = setInterval(() => this.updateMetadata(), 10000);
    }

    stopMetadataPolling() {
        if (this.metadataInterval) clearInterval(this.metadataInterval);
    }

    async updateMetadata() {
        const station = this.player.currentStation;
        if (!station) return;
        const apiMap = { 'rock': 'indiepop', 'electronica': 'groovesalad', 'decades': 'u80s', 'blues': 'bluescorner' };
        const apiKey = apiMap[station.id];
        if (apiKey) {
            try {
                const response = await fetch(`https://somafm.com/songs/${apiKey}.json`);
                const data = await response.json();
                if (data && data.songs && data.songs.length > 0) {
                    const latest = data.songs[0];
                    this.currentTrack.textContent = latest.title || 'Unknown Title';
                    this.currentArtist.textContent = latest.artist || 'Unknown Artist';
                    return;
                }
            } catch (error) {}
        }
        this.currentTrack.textContent = 'Sintonizando...';
        this.currentArtist.textContent = station.name;
    }

    updateUIState(state) {
        this.statusLabel.textContent = this.getStatusText(state);
        const isPlaying = state === PLAYER_STATES.PLAYING;
        const isConnecting = state === PLAYER_STATES.CONNECTING;
        this.appBody.classList.remove('playing', 'connecting', 'error');
        if (isPlaying) this.appBody.classList.add('playing');
        if (isConnecting) this.appBody.classList.add('connecting');
        if (state === PLAYER_STATES.ERROR) this.appBody.classList.add('error');
    }

    updateUIStation(station) {
        this.stationTitle.textContent = station.name;
        this.stationSubtitle.textContent = station.description;
    }

    getStatusText(state) {
        const texts = { [PLAYER_STATES.STOPPED]: 'Ready', [PLAYER_STATES.CONNECTING]: 'Sync...', [PLAYER_STATES.PLAYING]: 'Online', [PLAYER_STATES.ERROR]: 'Error' };
        return texts[state] || 'Idle';
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new App();
});
